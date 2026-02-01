import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch
from sqlmodel import Session, select
from datetime import datetime

# Ensure app is imported correctly after any necessary patches
from backend.app.main import app
from backend.app.core.database import get_session
from backend.app.api.deps import get_current_active_user
from backend.app.models.user import User
from backend.app.models.conversation_message import Conversation, Message
# Import the actual AgentService to patch it correctly, if it exists, otherwise assume mock
# from backend.app.services.agent_service import AgentService

# Mock current_user for authenticated endpoints
@pytest.fixture(name="current_user")
def current_user_fixture():
    return User(id=1, email="test@example.com", hashed_password="hashedpassword")

# Create a test client for the FastAPI app
@pytest.fixture(name="client")
def client_fixture(current_user: User):
    # Override the dependency for current_user to always return our test user
    app.dependency_overrides[get_current_active_user] = lambda: current_user
    with TestClient(app) as client:
        yield client
    app.dependency_overrides.clear() # Clear overrides after test

# Mock dependencies for AgentService
@pytest.fixture
def mock_agent_service():
    service = MagicMock()
    # Mock the process_message method to return a canned response
    # The agent is assumed to return (response_text, tool_calls_list)
    service.process_message.return_value = ("Hello from AI!", [])
    return service

# Patch the get_agent_service dependency that main.py would use
@pytest.fixture(autouse=True) # Autouse means it's applied to all tests automatically
def patch_get_agent_service(mock_agent_service: MagicMock):
    # This patch assumes that main.py has a dependency to get the AgentService instance
    # e.g., `Depends(get_agent_service)`
    with patch("backend.app.main.AgentService", return_value=mock_agent_service): # Patch the class directly
        yield

# Mock the database session to avoid actual DB calls during endpoint tests
@pytest.fixture(name="session")
def session_fixture():
    session = MagicMock(spec=Session) # Use spec=Session to ensure it acts like a Session
    # Mock for session.get (e.g., for retrieving Conversation or User)
    session.get.return_value = None # Default, can be overridden per test
    # Mock for session.exec().first() and .all() if needed
    session.exec.return_value.first.return_value = None
    session.exec.return_value.all.return_value = []
    
    yield session
    session.close()

# Override get_session to use our mock session
@pytest.fixture(autouse=True)
def patch_get_session(session: MagicMock):
    app.dependency_overrides[get_session] = lambda: session
    yield
    app.dependency_overrides.clear()

# Test the chat endpoint with a new conversation
def test_chat_endpoint_new_conversation(client: TestClient, mock_agent_service: MagicMock, session: MagicMock, current_user: User):
    user_id = current_user.id
    message = "Hello chatbot!"
    
    # Mock the session to return a new conversation object when added
    mock_conversation = MagicMock(spec=Conversation, id=1, user_id=user_id)
    session.add.return_value = None # add usually returns None
    session.get.return_value = current_user # Make sure user exists when fetched by ID in the endpoint
    
    # Mock session.refresh for conversation
    def mock_refresh_conversation(instance):
        if isinstance(instance, Conversation):
            instance.id = 1
            instance.user_id = user_id
            instance.created_at = datetime.utcnow()
        elif isinstance(instance, Message):
            instance.id = 1 # or some ID
            instance.timestamp = datetime.utcnow()
        return instance

    session.refresh.side_effect = mock_refresh_conversation
    
    response = client.post(f"/api/{user_id}/chat", json={"message": message})
    
    assert response.status_code == 200
    response_data = response.json()
    assert response_data["conversation_id"] == 1
    assert response_data["response"] == "Hello from AI!"
    assert response_data["tool_calls"] == []
    
    # Verify a new conversation was added
    session.add.assert_any_call(isinstance(session.add.call_args[0][0], Conversation))
    
    # Verify user message was stored
    session.add.assert_any_call(isinstance(session.add.call_args[0][0], Message))
    added_user_message = session.add.call_args_list[1].args[0] # Assuming conversation is added first
    assert added_user_message.conversation_id == 1
    assert added_user_message.sender_type == "user"
    assert added_user_message.content == message

    # Verify AI message was stored
    session.add.assert_any_call(isinstance(session.add.call_args[0][0], Message))
    added_ai_message = session.add.call_args_list[2].args[0] # Assuming user message is added second
    assert added_ai_message.conversation_id == 1
    assert added_ai_message.sender_type == "ai"
    assert added_ai_message.content == "Hello from AI!"
    assert added_ai_message.tool_calls == "[]"

    mock_agent_service.process_message.assert_called_once_with(
        user_id=user_id, message=message, conversation_history=[] 
    )

# Test the chat endpoint with an existing conversation and history retrieval
def test_chat_endpoint_existing_conversation_with_history(client: TestClient, mock_agent_service: MagicMock, session: MagicMock, current_user: User):
    user_id = current_user.id
    conversation_id = 123
    message = "Continue our chat."
    
    # Mock existing conversation retrieval
    mock_conversation = MagicMock(spec=Conversation, id=conversation_id, user_id=user_id)
    session.get.return_value = mock_conversation # For session.get(Conversation, conversation_id)
    session.get.side_effect = lambda model, id: mock_conversation if model == Conversation and id == conversation_id else current_user if model == User and id == user_id else None

    # Mock conversation history
    mock_history = [
        Message(conversation_id=conversation_id, sender_type="user", content="Hi", timestamp=datetime.utcnow(), id=1),
        Message(conversation_id=conversation_id, sender_type="ai", content="How can I help?", timestamp=datetime.utcnow(), id=2),
    ]
    # Mock session.exec(...).all()
    session.exec.return_value.all.return_value = mock_history

    # Mock agent response with a tool call
    mock_agent_service.process_message.return_value = ("Task created!", [{"tool_name": "add_task", "args": {"title": "new task"}}])

    response = client.post(f"/api/{user_id}/chat", json={"conversation_id": conversation_id, "message": message})
    
    assert response.status_code == 200
    response_data = response.json()
    assert response_data["conversation_id"] == conversation_id
    assert response_data["response"] == "Task created!"
    assert response_data["tool_calls"] == [{"tool_name": "add_task", "args": {"title": "new task"}}]
    
    expected_history_for_agent = [
        {"sender_type": "user", "content": "Hi"},
        {"sender_type": "ai", "content": "How can I help?"}
    ]
    mock_agent_service.process_message.assert_called_once_with(
        user_id=user_id, message=message, conversation_history=expected_history_for_agent
    )

    # Verify user message was stored
    session.add.assert_any_call(isinstance(session.add.call_args[0][0], Message))
    added_user_message = next(
        (call.args[0] for call in session.add.call_args_list if isinstance(call.args[0], Message) and call.args[0].sender_type == "user" and call.args[0].content == message),
        None
    )
    assert added_user_message is not None
    assert added_user_message.conversation_id == conversation_id

    # Verify AI message was stored
    added_ai_message = next(
        (call.args[0] for call in session.add.call_args_list if isinstance(call.args[0], Message) and call.args[0].sender_type == "ai" and call.args[0].content == "Task created!"),
        None
    )
    assert added_ai_message is not None
    assert added_ai_message.conversation_id == conversation_id
    assert added_ai_message.tool_calls == '[{"tool_name": "add_task", "args": {"title": "new task"}}]'


# Test the chat endpoint unauthenticated
def test_chat_endpoint_unauthenticated(): # This test does not need client fixture with current_user override
    # Temporarily remove override for current_user to simulate unauthenticated access
    original_get_current_active_user = app.dependency_overrides.pop(get_current_active_user, None)
    
    with TestClient(app) as client_unauth:
        response = client_unauth.post("/api/1/chat", json={"message": "test"})
        assert response.status_code == 401
    
    # Restore original dependency override if it existed
    if original_get_current_active_user:
        app.dependency_overrides[get_current_active_user] = original_get_current_active_user
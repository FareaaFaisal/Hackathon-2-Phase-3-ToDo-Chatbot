import pytest
import os # Keep os import for potential environment var patching if needed
from unittest.mock import MagicMock, patch

# Assuming the agent logic will be in backend/app/services/agent_service.py
# and it will depend on CohereService and MCP tools.

# Fixture for CohereService mock
@pytest.fixture
def mock_cohere_service():
    service = MagicMock()
    # Default mock Cohere's generate_response to return a simple text response
    service.generate_response.return_value = "Default AI response."
    return service

# Fixture for MCP tools mock
@pytest.fixture
def mock_mcp_tools():
    # Mock the individual MCP tool functions or a module exposing them
    tools = MagicMock()
    tools.add_task.return_value = {"message": "Task added successfully."}
    tools.list_tasks.return_value = {"tasks": [{"id": 1, "title": "Task 1"}, {"id": 2, "title": "Task 2"}]}
    tools.complete_task.return_value = {"message": "Task completed successfully."}
    tools.delete_task.return_value = {"message": "Task deleted successfully."}
    tools.update_task.return_value = {"message": "Task updated successfully."}
    return tools

# Fixture for AgentService with mocked dependencies
@pytest.fixture
def agent_service(mock_cohere_service, mock_mcp_tools):
    # Patch the CohereService dependency
    with patch('backend.app.services.agent_service.CohereService', return_value=mock_cohere_service):
        # Patch the MCP tools dependency. Assuming mcp_tools is imported as 'mcp_tools_module'
        # The actual import path for mcp_tools needs to be determined based on where they will be defined (T013)
        # For now, let's assume agent_service imports a module named mcp_tools_module.
        # This will need adjustment once T013 is implemented.
        class MockMCPToolsModule:
            # Replicating how we expect the tools to be exposed
            def add_task(self, *args, **kwargs):
                return mock_mcp_tools.add_task(*args, **kwargs)
            def list_tasks(self, *args, **kwargs):
                return mock_mcp_tools.list_tasks(*args, **kwargs)
            def complete_task(self, *args, **kwargs):
                return mock_mcp_tools.complete_task(*args, **kwargs)
            def delete_task(self, *args, **kwargs):
                return mock_mcp_tools.delete_task(*args, **kwargs)
            def update_task(self, *args, **kwargs):
                return mock_mcp_tools.update_task(*args, **kwargs)

        with patch('backend.app.services.agent_service.mcp_tools_module', new=MockMCPToolsModule()):
            from backend.app.services.agent_service import AgentService
            service = AgentService(cohere_service=mock_cohere_service) # Pass mock cohere_service explicitly if AgentService takes it
            yield service

def test_agent_initialization(agent_service):
    assert agent_service is not None

def test_process_message_intent_add_task(agent_service, mock_cohere_service, mock_mcp_tools):
    user_id = 1
    message = "Add a task to buy groceries"
    conversation_history = []

    # Mock Cohere to interpret "add a task" intent and return structured output
    mock_cohere_service.generate_response.return_value = """
    {"tool_calls": [{"tool_name": "add_task", "args": {"title": "buy groceries"}}]}
    """ # Simplified mock for intent/params

    response_text, tool_calls_result = agent_service.process_message(user_id, message, conversation_history)

    assert "Task added successfully." in response_text # Assuming the agent calls MCP tool and returns its response
    assert tool_calls_result is not None
    assert tool_calls_result[0]["tool_name"] == "add_task"
    assert tool_calls_result[0]["args"]["title"] == "buy groceries"
    mock_mcp_tools.add_task.assert_called_once_with(user_id=user_id, title="buy groceries", description=None) # Assuming description is optional

def test_process_message_intent_list_tasks(agent_service, mock_cohere_service, mock_mcp_tools):
    user_id = 1
    message = "Show me all pending tasks"
    conversation_history = []

    mock_cohere_service.generate_response.return_value = """
    {"tool_calls": [{"tool_name": "list_tasks", "args": {"status": "pending"}}]}
    """

    response_text, tool_calls_result = agent_service.process_message(user_id, message, conversation_history)

    assert "Task 1" in response_text
    assert "Task 2" in response_text
    assert tool_calls_result is not None
    assert tool_calls_result[0]["tool_name"] == "list_tasks"
    assert tool_calls_result[0]["args"]["status"] == "pending"
    mock_mcp_tools.list_tasks.assert_called_once_with(user_id=user_id, status="pending")

def test_process_message_unknown_intent(agent_service, mock_cohere_service):
    user_id = 1
    message = "Tell me a joke"
    conversation_history = []

    # Mock Cohere to return a non-tool-call response for unknown intent
    mock_cohere_service.generate_response.return_value = "I'm sorry, I can only help you with your to-do list."

    response_text, tool_calls_result = agent_service.process_message(user_id, message, conversation_history)

    assert "I'm sorry, I can only help you with your to-do list." in response_text
    assert tool_calls_result == [] # Expect no tool calls

def test_process_message_error_handling(agent_service, mock_cohere_service, mock_mcp_tools):
    user_id = 1
    message = "Complete task 999"
    conversation_history = []

    mock_cohere_service.generate_response.return_value = """
    {"tool_calls": [{"tool_name": "complete_task", "args": {"task_id": 999}}]}
    """
    mock_mcp_tools.complete_task.side_effect = ValueError("Task with ID 999 not found.") # Simulate error from MCP tool

    response_text, tool_calls_result = agent_service.process_message(user_id, message, conversation_history)

    assert "An error occurred while processing your request" in response_text
    assert "Task with ID 999 not found." in response_text
    assert tool_calls_result is not None
    assert tool_calls_result[0]["tool_name"] == "complete_task"
    assert tool_calls_result[0]["args"]["task_id"] == 999
    mock_mcp_tools.complete_task.assert_called_once_with(user_id=user_id, task_id=999)


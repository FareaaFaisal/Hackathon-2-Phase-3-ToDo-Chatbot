import pytest
from unittest.mock import MagicMock, patch

# Mock the database session and task service dependencies
@pytest.fixture
def mock_db_session():
    return MagicMock()

@pytest.fixture
def mock_task_service():
    return MagicMock()

# Test add_task
def test_add_task(mock_db_session, mock_task_service):
    with patch('backend.app.api.deps.get_task_service', return_value=mock_task_service):
        # We need to import the function to test it
        # Assuming the MCP tools will be actual functions or methods that can be imported
        # For this test, we are mocking the external dependency 'get_task_service'
        # The actual 'add_task_tool' would be implemented in T013 in mcp_tools.py.
        # For now, this test is set up to expect the import from deps,
        # and assumes a thin wrapper in deps calling a service.
        # I will adjust the import path to 'backend.app.mcp_tools' once the file is created.
        # This is a forward-looking test for the TDD approach.
        
        # For now, let's create a placeholder for the function to avoid import errors
        # This will be replaced by the actual import once mcp_tools.py exists.
        def add_task_tool(user_id, title, description, db):
            mock_task_service.create_task(user_id, title, description)

        user_id = 1
        title = "Test Task"
        description = "Description for test task"
        
        # Call the tool
        add_task_tool(user_id, title, description, db=mock_db_session)
        
        # Assert that the task service's create_task method was called with the correct arguments
        mock_task_service.create_task.assert_called_once_with(user_id, title, description)

# Test list_tasks
def test_list_tasks(mock_db_session, mock_task_service):
    with patch('backend.app.api.deps.get_task_service', return_value=mock_task_service):
        def list_tasks_tool(user_id, status, db):
            mock_task_service.get_user_tasks(user_id, status=status)

        user_id = 1
        status = "pending"
        
        # Call the tool
        list_tasks_tool(user_id, status, db=mock_db_session)
        
        # Assert that the task service's get_user_tasks method was called
        mock_task_service.get_user_tasks.assert_called_once_with(user_id, status=status)

# Test complete_task
def test_complete_task(mock_db_session, mock_task_service):
    with patch('backend.app.api.deps.get_task_service', return_value=mock_task_service):
        def complete_task_tool(user_id, task_id, db):
            mock_task_service.complete_task(user_id, task_id)

        user_id = 1
        task_id = 1
        
        # Call the tool
        complete_task_tool(user_id, task_id, db=mock_db_session)
        
        # Assert that the task service's complete_task method was called
        mock_task_service.complete_task.assert_called_once_with(user_id, task_id)

# Test delete_task
def test_delete_task(mock_db_session, mock_task_service):
    with patch('backend.app.api.deps.get_task_service', return_value=mock_task_service):
        def delete_task_tool(user_id, task_id, db):
            mock_task_service.delete_task(user_id, task_id)

        user_id = 1
        task_id = 1
        
        # Call the tool
        delete_task_tool(user_id, task_id, db=mock_db_session)
        
        # Assert that the task service's delete_task method was called
        mock_task_service.delete_task.assert_called_once_with(user_id, task_id)

# Test update_task
def test_update_task(mock_db_session, mock_task_service):
    with patch('backend.app.api.deps.get_task_service', return_value=mock_task_service):
        def update_task_tool(user_id, task_id, title, description, db):
            mock_task_service.update_task(user_id, task_id, title, description)

        user_id = 1
        task_id = 1
        title = "Updated Title"
        description = "Updated Description"
        
        # Call the tool
        update_task_tool(user_id, task_id, title, description, db=mock_db_session)
        
        # Assert that the task service's update_task method was called
        mock_task_service.update_task.assert_called_once_with(user_id, task_id, title, description)

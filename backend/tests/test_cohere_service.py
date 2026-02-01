import pytest
import os
from unittest.mock import MagicMock, patch
from backend.app.services.cohere_service import CohereService

# Fix: Adjust the import path to be relative or part of the python path
# For running tests, you might need to configure pytest to recognize 'backend' as a package root
# For now, let's assume the import works if run from the project root or with proper pytest config.


@pytest.fixture
def cohere_service():
    # Ensure COHERE_API_KEY is set in the environment for CohereService init
    with patch.dict(os.environ, {'COHERE_API_KEY': 'test_key'}):
        # Mock the cohere.Client for testing
        with patch('backend.app.services.cohere_service.cohere.Client') as MockClient:
            # Configure the mock client's generate method
            mock_response = MagicMock()
            mock_response.generations = [MagicMock(text="Mocked Cohere response.")]
            MockClient.return_value.generate.return_value = mock_response
            
            service = CohereService()
            yield service

def test_cohere_service_init_raises_error_if_no_api_key():
    # Temporarily remove COHERE_API_KEY from environment
    with patch.dict(os.environ, {}, clear=True): # Clear all environment variables
        with pytest.raises(ValueError, match="COHERE_API_KEY is not set in the environment variables."):
            CohereService()

def test_generate_response_success(cohere_service):
    prompt = "Hello, Cohere!"
    response_text = cohere_service.generate_response(prompt)
    assert response_text == "Mocked Cohere response."
    cohere_service.co.generate.assert_called_once_with(
        model='command-r',
        prompt=prompt,
        max_tokens=150,
        temperature=0.7,
        num_generations=1,
    )

def test_generate_response_no_generations(cohere_service):
    # Simulate a response with no generations
    cohere_service.co.generate.return_value.generations = []
    
    prompt = "Another prompt."
    response_text = cohere_service.generate_response(prompt)
    assert response_text == "I'm sorry, I couldn't generate a response."

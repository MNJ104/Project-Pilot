import pytest
from app.services.architecture_generator import generate_architecture
from app.services.database_designer import generate_database_design
from app.services.api_generator import generate_api_design
from app.services.tech_stack_recommender import generate_tech_stack
from app.services.sprint_planner import generate_sprint_plan
from app.services.cost_risk_analyzer import generate_cost_estimate, generate_risk_prediction
from app.services.documentation_generator import generate_documentation
from app.services.chat_assistant import chat
from app.schemas.chat_schema import ChatRequest, ChatMessageDto

TEST_TITLE = "CloudHealth EMR"
TEST_DESC = "A HIPAA-compliant electronic medical record system with patient portal, appointment booking, and clinical analytics."


def test_architecture_generator():
    result = generate_architecture(TEST_TITLE, TEST_DESC)
    assert result.style is not None
    assert len(result.style) > 3
    assert result.mermaid_diagram.startswith("graph")
    assert len(result.components) >= 3
    for comp in result.components:
        assert comp.name
        assert comp.tech_stack
        assert comp.communication_protocol


def test_database_designer():
    result = generate_database_design(TEST_TITLE, TEST_DESC)
    assert result.db_type == "PostgreSQL"
    assert result.mermaid_er_diagram.startswith("erDiagram")
    assert "CREATE TABLE" in result.migration_sql
    assert len(result.entities) >= 3


def test_api_generator():
    result = generate_api_design(TEST_TITLE, TEST_DESC)
    assert result.title is not None
    assert len(result.endpoints) >= 10
    has_post = any(ep.http_method == "POST" for ep in result.endpoints)
    has_get = any(ep.http_method == "GET" for ep in result.endpoints)
    assert has_post and has_get
    assert result.openapi_spec_json is not None


def test_tech_stack_recommender():
    result = generate_tech_stack(TEST_TITLE, TEST_DESC)
    assert len(result.recommendations) >= 5
    categories = {r.category for r in result.recommendations}
    assert "FRONTEND" in categories
    assert "BACKEND" in categories
    assert "DATABASE" in categories
    assert len(result.wireframes) >= 3


def test_sprint_planner():
    result = generate_sprint_plan(TEST_TITLE, TEST_DESC)
    assert len(result.sprints) == 3
    assert result.total_story_points > 20
    for sprint in result.sprints:
        assert sprint.name
        assert sprint.goal
        assert len(sprint.tasks) >= 3
        for task in sprint.tasks:
            assert task.title
            assert task.story_points in [1, 2, 3, 5, 8]


def test_cost_and_risk_analyzer():
    cost = generate_cost_estimate(TEST_TITLE, TEST_DESC)
    assert cost.total_monthly_usd > 0
    assert cost.compute_usd > 0
    assert cost.database_usd > 0

    risks = generate_risk_prediction(TEST_TITLE, TEST_DESC)
    assert len(risks.risks) >= 5
    for risk in risks.risks:
        assert risk.probability >= 1 and risk.probability <= 10
        assert risk.impact >= 1 and risk.impact <= 10
        assert risk.severity_score == risk.probability * risk.impact
        assert risk.mitigation_strategy


def test_documentation_generator():
    doc = generate_documentation(TEST_TITLE, TEST_DESC)
    assert doc.project_title == TEST_TITLE
    assert "IEEE 830" in doc.srs_markdown or "Requirements" in doc.srs_markdown
    assert len(doc.srs_markdown) > 500


def test_chat_assistant():
    req = ChatRequest(
        project_title=TEST_TITLE,
        project_context=TEST_DESC,
        messages=[
            ChatMessageDto(role="user", content="What database do you recommend and why?")
        ]
    )
    resp = chat(req)
    assert resp.reply is not None
    assert len(resp.reply) > 20


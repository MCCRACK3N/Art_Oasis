from main import app
from fastapi.testclient import TestClient
from authenticator import authenticator
from queries.users import UserOut, UserIn, UserRepository


client = TestClient(app)


# TEST CREATE USER
def fake_get_current_account_data():
    return UserOut(
        user_id=1,
        email="krze@gmail.com",
        profile_picture="test pfp",
        display_name="Eim_Krze",
        header_image="test header image",
        first_name="Eim",
        last_name="Krze",
        username="Krze",
        category="krze art",
        about="krze art dude",
    )


class FakeUserRepo:
    def fe_get_user(self, username: str):
        return UserOut(
            user_id=1,
            email="krze@gmail.com",
            profile_picture="test pfp",
            display_name="Eim_Krze",
            header_image="test header image",
            first_name="Eim",
            last_name="Krze",
            username="Krze",
            category="krze art",
            about="krze art dude",
        )

    def update_user(self, username: str, data: UserIn):
        return UserOut(
            user_id=1,
            email="krze@gmail.com",
            profile_picture="Crze pfp",
            display_name="Eim_Crze",
            header_image="test header image",
            first_name="Eim",
            last_name="Crze",
            username="Krze",
            category="Crze art",
            about="Crze art dude",
        )


def test_update_user():
    # Arrange
    app.dependency_overrides[UserRepository] = FakeUserRepo
    app.dependency_overrides[
        authenticator.get_current_account_data
    ] = fake_get_current_account_data

    # variable for the url
    username = "Krze"

    # EXPECTED RESULT
    updated_fake_user = UserOut(
        user_id=1,
        email="krze@gmail.com",
        profile_picture="Crze pfp",
        display_name="Eim_Crze",
        header_image="test header image",
        first_name="Eim",
        last_name="Crze",
        username="Krze",
        category="Crze art",
        about="Crze art dude",
    )

    # Act
    response = client.put(
        f"/api/users/{username}",
        headers={"Content-Type": "application/json"},
        json={
            "user_id": 1,
            "email": "krze@gmail.com",
            "profile_picture": "Crze pfp",
            "display_name": "Eim_Crze",
            "header_image": "test header image",
            "first_name": "Eim",
            "last_name": "Crze",
            "username": "Krze",
            "category": "Crze art",
            "about": "Crze art dude",
        },
    )

    # Clean up
    app.dependecy_overrides = {}

    # Assert
    assert response.status_code == 200
    assert response.json() == updated_fake_user


def test_get_user():
    # Arrange
    app.dependency_overrides[UserRepository] = FakeUserRepo
    app.dependency_overrides[
        authenticator.get_current_account_data
    ] = fake_get_current_account_data
    username = "Krze"
    fake_user = UserOut(
        user_id=1,
        email="krze@gmail.com",
        profile_picture="test pfp",
        display_name="Eim_Krze",
        header_image="test header image",
        first_name="Eim",
        last_name="Krze",
        username="Krze",
        category="krze art",
        about="krze art dude",
    )

    # Act
    response = client.get(f"/api/users/{username}")

    # Clean up
    app.dependency_overrides = {}

    # Assert
    assert response.status_code == 200
    assert response.json() == fake_user

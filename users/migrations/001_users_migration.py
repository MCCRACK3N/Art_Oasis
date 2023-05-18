steps = [
    [
        # "Up" SQL statement
        """
        CREATE TABLE users (
            id SERIAL NOT NULL UNIQUE PRIMARY KEY,
            email TEXT NOT NULL UNIQUE,
            profile_picture VARCHAR(1000),
            display_name VARCHAR(100),
            header_image VARCHAR(1000),
            first_name  VARCHAR(100) DEFAULT NULL,
            last_name  VARCHAR(100) DEFAULT NULL,
            category  VARCHAR(100) DEFAULT NULL
        );
        """,
        # "Down" SQL statement
        """
        DROP TABLE users;
        """
    ],
    [
        # "Up" SQL statement
        """
        CREATE TABLE connections(
            id SERIAL NOT NULL UNIQUE PRIMARY KEY,
            user_id INT,
            following_id INT,
            following BOOLEAN DEFAULT false
        );
        """,
        # "Down" SQL statement
        """
        DROP TABLE connections;
        """
    ],
    [
        # "Up" SQL statement
        """
        CREATE TABLE image_carousel(
            id SERIAL NOT NULL UNIQUE PRIMARY KEY,
            user_id INT,
            image_href VARCHAR(1000) DEFAULT NULL
        );
        """,
        # "Down" SQL statement
        """
        DROP TABLE image_carousel;
        """
    ],
    [
        # "Up" SQL statement
        """
        CREATE TABLE socials(
            id SERIAL NOT NULL UNIQUE PRIMARY KEY,
            user_id INT,
            link VARCHAR(1000) DEFAULT NULL
        );
        """,
        # "Down" SQL statement
        """
        DROP TABLE socials;
        """
    ]
]
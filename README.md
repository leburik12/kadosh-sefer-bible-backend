This is the backend for the KadoshSefer Bible app, built with Node.js and PostgreSQL. It provides APIs for Bible content management, user authentication using Twilio, and location-based features utilizing the PostGIS extension.

Features

Bible Content Management: APIs to retrieve and manage Bible verses, chapters, and books.
User Authentication: Secure user authentication using Twilio's SMS verification.
Church and Event Management: APIs for users to post church details and events.
Location-Based Services: Integration with PostGIS for geomapping and location-based queries.
Regular Expression Parsing: Utilizes regular expressions to efficiently fetch Bible content.
Technologies Used
Node.js: Backend framework for building scalable and efficient APIs.
PostgreSQL: Relational database for storing Bible data, user information, and event details.
redis database for cache service
PostGIS: PostgreSQL extension that enables location-based queries and geomapping features.
Twilio: SMS-based authentication service for securing user access.
Express.js: Web framework for creating RESTful APIs.
Setup
Prerequisites
Node.js v14+ installed on your machine.
PostgreSQL database installed with PostGIS extension enabled.
Twilio account with a phone number for SMS authentication.


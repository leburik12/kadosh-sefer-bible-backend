CREATE TABLE IF NOT EXISTS "user" (
       id INTEGER GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
       phone VARCHAR(12) NOT NULL UNIQUE,
       password_hash VARCHAR(60) NOT NULL,
       is_active BOOLEAN NOT NULL DEFAULT 't'
);

CREATE TABLE IF NOT EXISTS country (
    id VARCHAR(5) PRIMARY KEY NOT NULL,
    country_name VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS city (
    id INTEGER GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
    city_name VARCHAR(30) NOT NULL,
    id_country VARCHAR(5),
    FOREIGN KEY (id_country) REFERENCES country(id) ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX idx_city_name ON city(city_name);

CREATE TABLE IF NOT EXISTS church (
    id INTEGER GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location GEOMETRY(POINT, 4326) NOT NULL,  -- WGS 84 SRID for latitude and longitude
    image_name VARCHAR(255),
    description_text TEXT,
    id_user INTEGER,
    id_city INTEGER,
    email VARCHAR(255),
    phone VARCHAR(255),
    FOREIGN KEY (id_city) REFERENCES city(id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (id_user) REFERENCES "user"(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS church_images (
    id INTEGER GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
    image_name VARCHAR(255),
    video_image_name VARCHAR(255),
    id_church INTEGER,
    FOREIGN KEY (id_church) REFERENCES church(id) ON DELETE SET NULL ON UPDATE CASCADE
); 

CREATE TABLE IF NOT EXISTS church_program (
    id INTEGER GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
    program_name VARCHAR(255) NOT NULL,
    description TEXT,
    program_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    id_church INTEGER,
    FOREIGN KEY (id_church) REFERENCES church(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS church_event (
 id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 id_user INTEGER,
 id_church INTEGER,
 event_name VARCHAR(255) NOT NULL,
 event_description TEXT,
 start_date TIMESTAMPTZ NOT NULL,
 end_date TIMESTAMPTZ NOT NULL,
 duration INTEGER,
 eventstatus SMALLINT,
 eventcategory SMALLINT,  /* Worship Services, Sacramental Services,Educational Events, Community and Fellowship Events,Outreach and Service Events,Seasonal and Special Events,Retreats and Conferences, Music and Arts Events,Healing and Deliverance Services,Counseling and Support Groups  */
 geom_location GEOMETRY(Point, 4326),
 FOREIGN KEY (id_user) REFERENCES "user"(id) ON UPDATE CASCADE ON DELETE CASCADE,
 FOREIGN KEY (id_church) REFERENCES church(id) ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE INDEX idx_event_geom_location ON church_event USING GIST (geom_location);
CREATE INDEX idx_event_name ON church_event(event_name);



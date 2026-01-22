-- db/init.sql
CREATE TABLE IF NOT EXISTS public.events
(
    id character varying(255) NOT NULL,
    text text NOT NULL,
    datetime timestamp without time zone NOT NULL,
    CONSTRAINT events_pkey PRIMARY KEY (id)
);

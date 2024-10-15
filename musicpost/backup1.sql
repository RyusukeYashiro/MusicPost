SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';
SET default_table_access_method = heap;

-- 既存のテーブルを削除
DROP TABLE IF EXISTS public.music CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.relationships CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- テーブルの作成
CREATE TABLE public.music (
    id character varying(255) NOT NULL,
    name character varying NOT NULL,
    album_art_url character varying(255),
    music_url character varying(255),
    artist character varying(255),
    artist_url character varying(255),
    preview_url character varying(255),
    PRIMARY KEY (id)  -- 主キーをここで定義
);

CREATE TABLE public.posts (
    id integer NOT NULL DEFAULT nextval('public.posts_id_seq'),
    content character varying(255) NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    music_id character varying(255) NOT NULL,
    user_name character varying(255),
    PRIMARY KEY (id)  -- 主キーをここで定義
);

CREATE SEQUENCE public.posts_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.posts_id_seq OWNED BY public.posts.id;

CREATE TABLE public.relationships (
    id integer NOT NULL DEFAULT nextval('public.relationships_id_seq'),
    follower_id integer,
    followed_id integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    PRIMARY KEY (id)  -- 主キーをここで定義
);

CREATE SEQUENCE public.relationships_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.relationships_id_seq OWNED BY public.relationships.id;

CREATE TABLE public.users (
    id integer NOT NULL DEFAULT nextval('public.users_id_seq'),
    content character varying(255) NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    music_id character varying(255),
    user_name character varying(255),
    PRIMARY KEY (id)  -- 主キーをここで定義
);

CREATE SEQUENCE public.users_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;

-- データの挿入（必要なデータを追加してください）
-- COPY public.music (id, name, album_art_url, music_url, artist, artist_url, preview_url) FROM stdin;
-- \.

-- COPY public.posts (id, content, user_id, created_at, updated_at, music_id, user_name) FROM stdin;
-- \.

-- COPY public.relationships (id, follower_id, followed_id, created_at, updated_at) FROM stdin;
-- \.

-- COPY public.users (id, content, user_id, created_at, updated_at, music_id, user_name) FROM stdin;
-- \.

-- SEQUENCEの初期値設定
SELECT pg_catalog.setval('public.posts_id_seq', 1, false);
SELECT pg_catalog.setval('public.relationships_id_seq', 1, false);
SELECT pg_catalog.setval('public.users_id_seq', 1, false);

-- 権限の設定
GRANT ALL ON SCHEMA public TO ryusuke;

-- DEFAULT PRIVILEGESの設定
ALTER DEFAULT PRIVILEGES FOR ROLE ryusukeyashiro IN SCHEMA public GRANT ALL ON SEQUENCES TO ryusuke;
ALTER DEFAULT PRIVILEGES FOR ROLE ryusukeyashiro IN SCHEMA public GRANT ALL ON TABLES TO ryusuke;


ALTER TABLE users ADD COLUMN password VARCHAR(255);

alter table users add column email varchar(255);

alter table users DROP column content;

alter table users DROP column user_id;
-- PostgreSQL database dump complete

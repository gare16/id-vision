--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2 (Debian 17.2-1.pgdg120+1)
-- Dumped by pg_dump version 17.2 (Debian 17.2-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Log_Pengunjung; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Log_Pengunjung" (
    id_log integer NOT NULL,
    rfid_tag text NOT NULL,
    nik text NOT NULL,
    waktu timestamp(3) without time zone NOT NULL,
    access boolean NOT NULL,
    lokasi text NOT NULL
);


ALTER TABLE public."Log_Pengunjung" OWNER TO postgres;

--
-- Name: Log_Pengunjung_id_log_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Log_Pengunjung_id_log_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Log_Pengunjung_id_log_seq" OWNER TO postgres;

--
-- Name: Log_Pengunjung_id_log_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Log_Pengunjung_id_log_seq" OWNED BY public."Log_Pengunjung".id_log;


--
-- Name: Pengunjung; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Pengunjung" (
    id integer NOT NULL,
    nik text NOT NULL,
    nama text NOT NULL,
    alamat text NOT NULL,
    ttl text NOT NULL
);


ALTER TABLE public."Pengunjung" OWNER TO postgres;

--
-- Name: Pengunjung_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Pengunjung_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Pengunjung_id_seq" OWNER TO postgres;

--
-- Name: Pengunjung_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Pengunjung_id_seq" OWNED BY public."Pengunjung".id;


--
-- Name: Rfid_Tag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Rfid_Tag" (
    rfid_tag text NOT NULL,
    nik text,
    status boolean NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public."Rfid_Tag" OWNER TO postgres;

--
-- Name: Rfid_Tag_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Rfid_Tag_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Rfid_Tag_id_seq" OWNER TO postgres;

--
-- Name: Rfid_Tag_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Rfid_Tag_id_seq" OWNED BY public."Rfid_Tag".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    user_id integer NOT NULL,
    username text NOT NULL,
    password text NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: User_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_user_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_user_id_seq" OWNER TO postgres;

--
-- Name: User_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_user_id_seq" OWNED BY public."User".user_id;


--
-- Name: Log_Pengunjung id_log; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Log_Pengunjung" ALTER COLUMN id_log SET DEFAULT nextval('public."Log_Pengunjung_id_log_seq"'::regclass);


--
-- Name: Pengunjung id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Pengunjung" ALTER COLUMN id SET DEFAULT nextval('public."Pengunjung_id_seq"'::regclass);


--
-- Name: Rfid_Tag id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Rfid_Tag" ALTER COLUMN id SET DEFAULT nextval('public."Rfid_Tag_id_seq"'::regclass);


--
-- Name: User user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN user_id SET DEFAULT nextval('public."User_user_id_seq"'::regclass);


--
-- Data for Name: Log_Pengunjung; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Log_Pengunjung" (id_log, rfid_tag, nik, waktu, access, lokasi) FROM stdin;
16	TAG00001	320101000001	2025-05-10 07:36:26.686	f	Lokasi 1
17	TAG00002	320101000002	2025-05-09 07:36:26.686	t	Lokasi 2
18	TAG00003	320101000003	2025-05-08 07:36:26.686	f	Lokasi 3
21	TAG00006	320101000006	2025-05-05 07:36:26.686	t	Lokasi 6
22	TAG00007	320101000007	2025-05-04 07:36:26.686	f	Lokasi 7
23	TAG00008	320101000008	2025-05-03 07:36:26.686	t	Lokasi 8
24	TAG00009	320101000009	2025-05-02 07:36:26.686	f	Lokasi 9
25	TAG00010	3201010000010	2025-05-01 07:36:26.686	t	Lokasi 10
26	TAG00011	3201010000011	2025-04-30 07:36:26.686	f	Lokasi 11
27	TAG00012	3201010000012	2025-04-29 07:36:26.686	t	Lokasi 12
28	TAG00013	3201010000013	2025-04-28 07:36:26.686	f	Lokasi 13
29	TAG00014	3201010000014	2025-04-27 07:36:26.686	t	Lokasi 14
30	TAG00015	3201010000015	2025-04-26 07:36:26.686	f	Lokasi 15
31	TAG00001	320101000001	2025-05-10 07:37:26.82	f	Lokasi 1
32	TAG00002	320101000002	2025-05-09 07:37:26.82	t	Lokasi 2
33	TAG00003	320101000003	2025-05-08 07:37:26.82	f	Lokasi 3
34	TAG00004	320101000004	2025-05-07 07:37:26.82	t	Lokasi 4
35	TAG00005	320101000005	2025-05-06 07:37:26.82	f	Lokasi 5
36	TAG00006	320101000006	2025-05-05 07:37:26.82	t	Lokasi 6
37	TAG00007	320101000007	2025-05-04 07:37:26.82	f	Lokasi 7
38	TAG00008	320101000008	2025-05-03 07:37:26.82	t	Lokasi 8
39	TAG00009	320101000009	2025-05-02 07:37:26.82	f	Lokasi 9
40	TAG00010	3201010000010	2025-05-01 07:37:26.82	t	Lokasi 10
41	TAG00011	3201010000011	2025-04-30 07:37:26.82	f	Lokasi 11
42	TAG00012	3201010000012	2025-04-29 07:37:26.82	t	Lokasi 12
43	TAG00013	3201010000013	2025-04-28 07:37:26.82	f	Lokasi 13
44	TAG00014	3201010000014	2025-04-27 07:37:26.82	t	Lokasi 14
45	TAG00015	3201010000015	2025-04-26 07:37:26.82	f	Lokasi 15
46	TAG00001	320101000001	2025-05-10 07:38:20.809	t	Lokasi 1
47	TAG00002	320101000002	2025-05-09 07:38:20.809	f	Lokasi 2
48	TAG00003	320101000003	2025-05-08 07:38:20.809	t	Lokasi 3
49	TAG00004	320101000004	2025-05-07 07:38:20.809	f	Lokasi 4
50	TAG00005	320101000005	2025-05-06 07:38:20.809	t	Lokasi 5
51	TAG00006	320101000006	2025-05-05 07:38:20.809	f	Lokasi 6
52	TAG00007	320101000007	2025-05-04 07:38:20.809	t	Lokasi 7
53	TAG00008	320101000008	2025-05-03 07:38:20.809	f	Lokasi 8
54	TAG00009	320101000009	2025-05-02 07:38:20.809	t	Lokasi 9
55	TAG00010	3201010000010	2025-05-01 07:38:20.809	f	Lokasi 10
56	TAG00011	3201010000011	2025-04-30 07:38:20.809	t	Lokasi 11
57	TAG00012	3201010000012	2025-04-29 07:38:20.809	f	Lokasi 12
58	TAG00013	3201010000013	2025-04-28 07:38:20.809	t	Lokasi 13
59	TAG00014	3201010000014	2025-04-27 07:38:20.809	f	Lokasi 14
60	TAG00015	3201010000015	2025-04-26 07:38:20.809	t	Lokasi 15
61	TAG00001	320101000001	2025-05-10 07:38:34.149	t	Lokasi 1
62	TAG00002	320101000002	2025-05-09 07:38:34.149	f	Lokasi 2
63	TAG00003	320101000003	2025-05-08 07:38:34.149	t	Lokasi 3
64	TAG00004	320101000004	2025-05-07 07:38:34.149	f	Lokasi 4
65	TAG00005	320101000005	2025-05-06 07:38:34.149	t	Lokasi 5
66	TAG00006	320101000006	2025-05-05 07:38:34.149	f	Lokasi 6
67	TAG00007	320101000007	2025-05-04 07:38:34.149	t	Lokasi 7
68	TAG00008	320101000008	2025-05-03 07:38:34.149	f	Lokasi 8
69	TAG00009	320101000009	2025-05-02 07:38:34.149	t	Lokasi 9
70	TAG00010	3201010000010	2025-05-01 07:38:34.149	f	Lokasi 10
71	TAG00011	3201010000011	2025-04-30 07:38:34.149	t	Lokasi 11
72	TAG00012	3201010000012	2025-04-29 07:38:34.149	f	Lokasi 12
73	TAG00013	3201010000013	2025-04-28 07:38:34.149	t	Lokasi 13
74	TAG00014	3201010000014	2025-04-27 07:38:34.149	f	Lokasi 14
75	TAG00015	3201010000015	2025-04-26 07:38:34.149	t	Lokasi 15
19	TAG00004	320101000004	2025-05-09 07:36:26.686	t	Lokasi 4
20	TAG00005	320101000005	2025-05-12 07:36:26.686	f	Lokasi 5
\.


--
-- Data for Name: Pengunjung; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Pengunjung" (id, nik, nama, alamat, ttl) FROM stdin;
16	320101000001	Nama Pengunjung 1	Alamat 1	2025-04-02
17	320101000002	Nama Pengunjung 2	Alamat 2	2025-04-03
18	320101000003	Nama Pengunjung 3	Alamat 3	2025-04-04
19	320101000004	Nama Pengunjung 4	Alamat 4	2025-04-05
20	320101000005	Nama Pengunjung 5	Alamat 5	2025-04-06
21	320101000006	Nama Pengunjung 6	Alamat 6	2025-04-07
22	320101000007	Nama Pengunjung 7	Alamat 7	2025-04-08
23	320101000008	Nama Pengunjung 8	Alamat 8	2025-04-09
24	320101000009	Nama Pengunjung 9	Alamat 9	2025-04-10
25	3201010000010	Nama Pengunjung 10	Alamat 10	2025-04-11
26	3201010000011	Nama Pengunjung 11	Alamat 11	2025-04-12
27	3201010000012	Nama Pengunjung 12	Alamat 12	2025-04-13
28	3201010000013	Nama Pengunjung 13	Alamat 13	2025-04-14
29	3201010000014	Nama Pengunjung 14	Alamat 14	2025-04-15
30	3201010000015	Nama Pengunjung 15	Alamat 15	2025-04-16
31	3201010000016	Nama Pengunjung 16	Alamat 16	1990-01-17
32	3201010000017	Nama Pengunjung 17	Alamat 17	1990-01-18
33	3201010000018	Nama Pengunjung 18	Alamat 18	1990-01-19
34	3201010000019	Nama Pengunjung 19	Alamat 19	1990-01-20
35	3201010000020	Nama Pengunjung 20	Alamat 20	1990-01-21
36	3201010000021	Nama Pengunjung 21	Alamat 21	1990-01-22
37	3201010000022	Nama Pengunjung 22	Alamat 22	1990-01-23
38	3201010000023	Nama Pengunjung 23	Alamat 23	1990-01-24
39	3201010000024	Nama Pengunjung 24	Alamat 24	1990-01-25
40	3201010000025	Nama Pengunjung 25	Alamat 25	1990-01-26
41	3201010000026	Nama Pengunjung 26	Alamat 26	1990-01-27
42	3201010000027	Nama Pengunjung 27	Alamat 27	1990-01-28
43	3201010000028	Nama Pengunjung 28	Alamat 28	1990-01-01
44	3201010000029	Nama Pengunjung 29	Alamat 29	1990-01-02
45	3201010000030	Nama Pengunjung 30	Alamat 30	1990-01-03
\.


--
-- Data for Name: Rfid_Tag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Rfid_Tag" (rfid_tag, nik, status, id) FROM stdin;
TAG00013	3201010000013	f	1
TAG00001	320101000001	t	2
TAG00009	320101000009	f	3
TAG00015	3201010000015	f	4
TAG00004	320101000004	f	5
TAG00008	320101000008	f	6
TAG00003	320101000003	f	7
TAG00014	3201010000014	f	8
TAG00005	320101000005	f	9
TAG00002	320101000002	f	10
TAG00012	3201010000012	f	11
TAG00006	320101000006	f	12
TAG00010	3201010000010	f	13
TAG00011	3201010000011	f	14
TAG00007	320101000007	t	15
TAG00016	\N	f	16
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (user_id, username, password) FROM stdin;
\.


--
-- Name: Log_Pengunjung_id_log_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Log_Pengunjung_id_log_seq"', 75, true);


--
-- Name: Pengunjung_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Pengunjung_id_seq"', 45, true);


--
-- Name: Rfid_Tag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Rfid_Tag_id_seq"', 16, true);


--
-- Name: User_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_user_id_seq"', 1, false);


--
-- Name: Log_Pengunjung Log_Pengunjung_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Log_Pengunjung"
    ADD CONSTRAINT "Log_Pengunjung_pkey" PRIMARY KEY (id_log);


--
-- Name: Pengunjung Pengunjung_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Pengunjung"
    ADD CONSTRAINT "Pengunjung_pkey" PRIMARY KEY (id);


--
-- Name: Rfid_Tag Rfid_Tag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Rfid_Tag"
    ADD CONSTRAINT "Rfid_Tag_pkey" PRIMARY KEY (rfid_tag);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (user_id);


--
-- Name: Pengunjung_nik_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Pengunjung_nik_key" ON public."Pengunjung" USING btree (nik);


--
-- Name: Log_Pengunjung Log_Pengunjung_id_tag_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Log_Pengunjung"
    ADD CONSTRAINT "Log_Pengunjung_id_tag_fkey" FOREIGN KEY (rfid_tag) REFERENCES public."Rfid_Tag"(rfid_tag) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Log_Pengunjung Log_Pengunjung_nik_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Log_Pengunjung"
    ADD CONSTRAINT "Log_Pengunjung_nik_fkey" FOREIGN KEY (nik) REFERENCES public."Pengunjung"(nik) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Rfid_Tag Rfid_Tag_nik_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Rfid_Tag"
    ADD CONSTRAINT "Rfid_Tag_nik_fkey" FOREIGN KEY (nik) REFERENCES public."Pengunjung"(nik) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--


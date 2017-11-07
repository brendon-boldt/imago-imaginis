--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: administrator
--

CREATE SEQUENCE user_id_seq
    START WITH 10
    INCREMENT BY 1
    MINVALUE 10
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_seq OWNER TO administrator;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: asp_users; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE asp_users (
    user_id integer DEFAULT nextval('user_id_seq'::regclass) NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    date_joined date NOT NULL,
    status boolean DEFAULT true NOT NULL,
    profile_photo character varying(255),
    admin boolean
);


ALTER TABLE public.asp_users OWNER TO postgres;

--
-- Name: filter_id_seq; Type: SEQUENCE; Schema: public; Owner: administrator
--

CREATE SEQUENCE filter_id_seq
    START WITH 5
    INCREMENT BY 1
    MINVALUE 5
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.filter_id_seq OWNER TO administrator;

--
-- Name: filters; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE filters (
    filter_id integer DEFAULT nextval('filter_id_seq'::regclass) NOT NULL,
    name character varying(50) NOT NULL,
    path character varying(255),
    preset boolean
);


ALTER TABLE public.filters OWNER TO postgres;

--
-- Name: paid_users; Type: TABLE; Schema: public; Owner: administrator; Tablespace: 
--

CREATE TABLE paid_users (
    user_id integer NOT NULL
);


ALTER TABLE public.paid_users OWNER TO administrator;

--
-- Name: photo_id_seq; Type: SEQUENCE; Schema: public; Owner: administrator
--

CREATE SEQUENCE photo_id_seq
    START WITH 15
    INCREMENT BY 1
    MINVALUE 15
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.photo_id_seq OWNER TO administrator;

--
-- Name: photos; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE photos (
    photo_id integer DEFAULT nextval('photo_id_seq'::regclass) NOT NULL,
    size double precision NOT NULL,
    creation_date date NOT NULL,
    path character varying(255) NOT NULL,
    process_time integer NOT NULL,
    flag boolean NOT NULL,
    display boolean NOT NULL,
    height integer NOT NULL,
    width integer NOT NULL,
    CONSTRAINT photo_size_check CHECK ((size > (0)::double precision))
);


ALTER TABLE public.photos OWNER TO postgres;

--
-- Name: stat_types; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE stat_types (
    stat_id integer NOT NULL,
    stat_name character varying(50) NOT NULL
);


ALTER TABLE public.stat_types OWNER TO postgres;

--
-- Name: unfiltered_photo_id_seq; Type: SEQUENCE; Schema: public; Owner: administrator
--

CREATE SEQUENCE unfiltered_photo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.unfiltered_photo_id_seq OWNER TO administrator;

--
-- Name: unfiltered_photo; Type: TABLE; Schema: public; Owner: administrator; Tablespace: 
--

CREATE TABLE unfiltered_photo (
    unfiltered_photo_id integer DEFAULT nextval('unfiltered_photo_id_seq'::regclass) NOT NULL,
    size integer NOT NULL,
    height integer NOT NULL,
    width integer NOT NULL,
    path character varying(255) NOT NULL
);


ALTER TABLE public.unfiltered_photo OWNER TO administrator;

--
-- Name: unfiltered_video; Type: TABLE; Schema: public; Owner: administrator; Tablespace: 
--

CREATE TABLE unfiltered_video (
    unfiltered_video_id integer NOT NULL,
    size integer NOT NULL,
    height integer NOT NULL,
    width integer NOT NULL,
    path character varying(255) NOT NULL
);


ALTER TABLE public.unfiltered_video OWNER TO administrator;

--
-- Name: usage; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE usage (
    user_id integer NOT NULL,
    "timestamp" timestamp without time zone NOT NULL,
    stat_id integer
);


ALTER TABLE public.usage OWNER TO postgres;

--
-- Name: user_photo; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE user_photo (
    user_id integer NOT NULL,
    photo_id integer NOT NULL,
    filter_id integer NOT NULL,
    status character varying(255) NOT NULL,
    wait_time integer NOT NULL,
    unfiltered_photo_id integer
);


ALTER TABLE public.user_photo OWNER TO postgres;

--
-- Name: user_video; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE user_video (
    user_id integer NOT NULL,
    video_id integer NOT NULL,
    filter_id integer NOT NULL,
    status character varying(255),
    wait_time integer NOT NULL,
    unfiltered_video_id integer
);


ALTER TABLE public.user_video OWNER TO postgres;

--
-- Name: videos; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE videos (
    video_id integer NOT NULL,
    size double precision NOT NULL,
    creation_date date NOT NULL,
    path character varying(255) NOT NULL,
    process_time integer NOT NULL,
    flag boolean NOT NULL,
    display boolean NOT NULL,
    CONSTRAINT video_size_check CHECK ((size > (0)::double precision))
);


ALTER TABLE public.videos OWNER TO postgres;

--
-- Data for Name: asp_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY asp_users (user_id, first_name, last_name, email, password, date_joined, status, profile_photo, admin) FROM stdin;
1	Antonio	DelVecchio	delvecad@gmail.com	sdfhp9gqerg97q93gqeruiggdisiasefeq4wr	2017-10-09	t	\N	t
2	Leo	Keefe	leo.keefe@email.com	jehg79qe4q8gy9u3h4p598ehgrghwe8e5gywe9pgy5e8ew8rhure	2017-10-10	t	\N	f
3	Dennis	Murray	hipHipMurray@marist.edu	dff7qp34wiyrfg8foy3g4r7qpe9grgyghjdsfkqdapf	2017-10-10	t	\N	f
4	David	Yellen	david.yellen@marist.edu	sdfgqe7eilyggkh6ueoggile7is47rtafsrubgfjer	2017-10-10	t	\N	f
5	Jon	Butensky	jon.butensky@marist.edu	dfjkhgergqughqoghhugrkdhfgs8dhguerihl	2017-10-10	t	\N	f
6	Kai	Wong	kai.wong@marist.edu	fdghwfgwe5dtghdyjet7hr5645wysdhwrt556456w	2017-10-10	t	\N	f
7	Zachary	Recolan	zachary.recolan@marist.edu	sdfguhweli5udsrghwei7sduyrghwe7ilsdrgusighdfg	2017-10-10	t	\N	f
8	Brendon	Boldt	brendon.boldt@marist.edu	asdfgqerli74lierughwt7e4534862345grasdfaisuf	2017-10-10	t	\N	f
0	test	user	test.user@email.com	123456	2017-10-09	t	\N	f
10	asdf	asdf	asdf	asdf	2017-10-30	t	\N	f
11	tes	use	amsd	fs	2017-10-30	t	\N	f
14	a	a	s	d	2017-10-30	t	\N	f
15	undefined	undefined	undefined	undefined	2017-10-30	t	\N	f
23	asfd	asdf	qfdsaf	f31	2017-10-30	t	\N	f
24	ads	asd	asd	asdf	2017-10-30	t	\N	f
25	asdf	f23g2g	qwf213	asdf1	2017-10-30	t	\N	f
26	asdf	fasdf13fea	asdf1	asdf1	2017-10-30	t	\N	f
27	asdf	af13f	asdfqewf	asdf	2017-10-30	t	\N	f
30	Wendy	Ni	Si.Ni1@marist.edu	123	2017-10-31	t	\N	f
31	Donald	Trump	america.is@great.com	imstupid	2017-10-31	t	\N	f
32	Tommy	Magnusson	tommy.mag@marist.edu	[object Object]	2017-10-31	t	\N	f
21	test	test21	fsadfds@fsfdsaf.com	da1547fe74144fbc16a3ea3ce11a18be6c19fed0e1e91b9c567d485b86f7baac	2017-10-30	t	\N	f
34	Tienzza	Sux	tien.sux@it.istrue.com	5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5	2017-11-01	t	\N	f
35	Tien	IsSexy	my.name@isntTrue.com	f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b	2017-11-01	t	\N	f
36	HEY	Ha	Ha	72aa80bf1ac4eef0263917c350d8941a1c3f90b3b50d1232b52e6ceda51d53d4	2017-11-01	t	\N	f
33	PabloHaj	Rivasosexy	yolo.swag@gmail.com	5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5	2017-10-31	t	/home/administrator/files/images/uploads/upload-1509764430796.png	f
37	Kai	Wong	kwwong1597@gmail.com	f2c77f9dd927df4fe2521bdc1415e3dcbb28dc8d60bddb9a96c96b90b46c2f49	2017-11-06	t	\N	\N
\.


--
-- Name: filter_id_seq; Type: SEQUENCE SET; Schema: public; Owner: administrator
--

SELECT pg_catalog.setval('filter_id_seq', 21, true);


--
-- Data for Name: filters; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY filters (filter_id, name, path, preset) FROM stdin;
0	Khalo	/home/administrator/files/images/filters/filter-0.jpg	t
1	VanGogh	/home/administrator/files/images/filters/filter-1.jpg	t
2	Picasso	/home/administrator/files/images/filters/filter-2.jpg	t
3	Flowers	/home/administrator/files/images/filters/filter-3.jpg	t
4	Spiders	/home/administrator/files/images/filters/filter-4.jpg	t
17	33	/home/administrator/files/images/filters/filter-17.png	f
18	33	/home/administrator/files/images/filters/filter-18.jpg	f
19	33	/home/administrator/files/images/filters/filter-19.jpg	f
20	33	/home/administrator/files/images/filters/filter-20.jpg	f
21	33	/home/administrator/files/images/filters/filter-21.jpg	f
\.


--
-- Data for Name: paid_users; Type: TABLE DATA; Schema: public; Owner: administrator
--

COPY paid_users (user_id) FROM stdin;
21
1
2
\.


--
-- Name: photo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: administrator
--

SELECT pg_catalog.setval('photo_id_seq', 96, true);


--
-- Data for Name: photos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY photos (photo_id, size, creation_date, path, process_time, flag, display, height, width) FROM stdin;
82	1.00000000000000002e-08	1970-01-01		0	f	f	0	0
83	1.00000000000000002e-08	1970-01-01		0	f	f	0	0
81	1.00000000000000002e-08	1970-01-01	/home/administrator/files/images/uploads/upload-16.png	0	f	f	264	264
1	2.33999999999999986	2017-10-09	c://uobgnjergohdfbjnsf	4	t	t	100	100
2	0.119999999999999996	2017-10-09	c://ghoigrejkdfsgjlgas	3	t	t	100	100
7	1.22999999999999998	2017-10-10	c://asdfasdfasdfasdfsadf/asdfasdf	6	f	t	100	100
8	1.22999999999999998	2017-10-10	c://asdfasdfa/sdfadsafd	5	f	t	100	100
9	0.550000000000000044	2017-10-11	c://asdfasyuityutyiuyt	4	f	t	100	100
10	0.550000000000000044	2017-10-11	c://asdfasdfasdfasdfsadfagaa	4	f	t	100	100
23	3	2017-10-18	somepath\\C:\\Users\\KaiWong\\upload-1508785060781.PNG	5	f	t	100	100
24	3	2017-10-18	somepath\\C:\\Users\\KaiWong\\upload-1508967299246.png	5	f	t	100	100
0	1.22999999999999998	2017-10-09	c://asdfasdfasdfasdfsadf	3	f	t	100	100
5	1.22999999999999998	2017-10-10	c://asdfasddsfgdsfgdsfg	2	f	t	100	100
3	0.550000000000000044	2017-10-09	c://asfdghdghdfghd	5	f	t	100	100
4	1.22999999999999998	2017-10-10	c://asdfasdf5yeerthverthv	4	f	t	100	100
6	1.22999999999999998	2017-10-10	c://asdfasdf/asdfasdf	3	f	t	100	100
35	1.00000000000000002e-08	1970-01-01		0	f	f	0	0
36	1.00000000000000002e-08	1970-01-01		0	f	f	0	0
37	1.00000000000000002e-08	1970-01-01		0	f	f	0	0
38	1.00000000000000002e-08	1970-01-01		0	f	f	0	0
39	1.00000000000000002e-08	1970-01-01		0	f	f	0	0
40	1.00000000000000002e-08	1970-01-01		0	f	f	0	0
41	1.00000000000000002e-08	1970-01-01		0	f	f	0	0
42	1.00000000000000002e-08	1970-01-01		0	f	f	0	0
43	1.00000000000000002e-08	1970-01-01		0	f	f	0	0
44	1.00000000000000002e-08	1970-01-01		0	f	f	0	0
46	1.00000000000000002e-08	1970-01-01		0	f	f	0	0
45	1.00000000000000002e-08	1970-01-01		0	t	f	0	0
84	1.00000000000000002e-08	1970-01-01		0	f	f	0	0
85	1.00000000000000002e-08	1970-01-01		0	f	f	0	0
86	1.00000000000000002e-08	1970-01-01		0	f	f	0	0
87	1.00000000000000002e-08	1970-01-01		0	f	f	0	0
88	1.00000000000000002e-08	1970-01-01		0	f	f	0	0
47	1.00000000000000002e-08	1970-01-01		0	f	f	0	0
48	1.00000000000000002e-08	1970-01-01		0	f	f	0	0
52	1.00000000000000002e-08	1970-01-01	upload-1509494466459.png	0	f	f	0	0
53	1.00000000000000002e-08	1970-01-01	upload-1509504261488.png	0	f	f	0	0
54	1.00000000000000002e-08	1970-01-01	upload-1509506338682.png	0	f	f	0	0
56	1.00000000000000002e-08	1970-01-01	upload-1509506656205.png	0	f	f	0	0
57	1.00000000000000002e-08	1970-01-01	upload-1509506662219.png	0	f	f	0	0
58	1.00000000000000002e-08	1970-01-01	upload-1509506757091.png	0	f	f	0	0
64	1.00000000000000002e-08	1970-01-01	upload-1509514430520.png	0	f	f	0	0
89	1.00000000000000002e-08	1970-01-01		0	f	f	0	0
90	1.00000000000000002e-08	1970-01-01		0	f	f	0	0
91	1.00000000000000002e-08	1970-01-01		0	f	f	0	0
92	1.00000000000000002e-08	1970-01-01		0	f	f	0	0
93	1.00000000000000002e-08	1970-01-01		0	f	f	0	0
94	1.00000000000000002e-08	1970-01-01		0	f	f	0	0
95	1.00000000000000002e-08	1970-01-01		0	f	f	0	0
96	1.00000000000000002e-08	1970-01-01		0	f	f	0	0
50	1.00000000000000002e-08	1970-01-01	/home/administrator/files/images/uploads/upload-16.png	0	f	f	264	264
49	1.00000000000000002e-08	1970-01-01	/home/administrator/files/images/uploads/upload-16.png	0	f	t	264	264
51	1.00000000000000002e-08	1970-01-01	/home/administrator/files/images/uploads/upload-16.png	0	f	t	264	264
\.


--
-- Data for Name: stat_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY stat_types (stat_id, stat_name) FROM stdin;
0	numLogins
1	numUploads
2	processTime
\.


--
-- Data for Name: unfiltered_photo; Type: TABLE DATA; Schema: public; Owner: administrator
--

COPY unfiltered_photo (unfiltered_photo_id, size, height, width, path) FROM stdin;
0	500	10	10	/aspdb
2	3	264	264	upload-1509423890258.png
3	3	264	264	upload-1509424599511.png
4	3	264	264	upload-1509424677443.png
5	3	264	264	upload-1509425352855.png
6	120578	264	264	upload-1509425523426.png
7	120578	264	264	/home/administrator/files/images/uploads/upload-1509425662753.png
8	515047	264	264	/home/administrator/files/images/uploads/upload-1509429193264.JPG
11	120578	264	264	../../files/images/uploads/upload-1509578999196.png
16	120578	264	264	/home/administrator/files/images/uploads/upload-16.png
17	153609	264	264	/home/administrator/files/images/uploads/upload-17.jpg
18	613563	264	264	/home/administrator/files/images/uploads/upload-18.jpg
19	120578	264	264	/home/administrator/files/images/uploads/upload-19.png
20	153609	264	264	/home/administrator/files/images/uploads/upload-20.jpg
21	153609	264	264	/home/administrator/files/images/uploads/upload-21.jpg
22	1033076	264	264	/home/administrator/files/images/uploads/upload-22.jpg
23	613563	264	264	/home/administrator/files/images/uploads/upload-23.jpg
24	120578	264	264	/home/administrator/files/images/uploads/upload-24.png
\.


--
-- Name: unfiltered_photo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: administrator
--

SELECT pg_catalog.setval('unfiltered_photo_id_seq', 24, true);


--
-- Data for Name: unfiltered_video; Type: TABLE DATA; Schema: public; Owner: administrator
--

COPY unfiltered_video (unfiltered_video_id, size, height, width, path) FROM stdin;
0	500	10	10	\\aspdb
\.


--
-- Data for Name: usage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY usage (user_id, "timestamp", stat_id) FROM stdin;
2	2017-10-09 00:00:00	0
3	2017-10-10 09:12:20	2
\.


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: administrator
--

SELECT pg_catalog.setval('user_id_seq', 37, true);


--
-- Data for Name: user_photo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY user_photo (user_id, photo_id, filter_id, status, wait_time, unfiltered_photo_id) FROM stdin;
0	43	2	waiting	0	5
0	45	2	waiting	0	6
0	46	2	waiting	0	7
33	47	4	waiting	0	8
33	49	0	done	0	\N
33	50	0	done	0	\N
33	51	0	done	0	\N
34	64	0	done	0	\N
33	81	0	done	0	\N
33	88	2	waiting	0	16
33	92	17	waiting	0	20
33	93	18	waiting	0	21
33	94	19	waiting	0	22
33	95	20	waiting	0	23
33	96	21	waiting	0	24
\.


--
-- Data for Name: user_video; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY user_video (user_id, video_id, filter_id, status, wait_time, unfiltered_video_id) FROM stdin;
1	4	1	waiting	10	0
2	6	1	waiting	10	0
3	1	1	waiting	10	0
4	5	1	waiting	10	0
5	8	1	waiting	10	0
6	7	1	waiting	10	0
7	0	1	waiting	10	0
0	2	1	done	10	0
0	3	1	done	10	0
\.


--
-- Data for Name: videos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY videos (video_id, size, creation_date, path, process_time, flag, display) FROM stdin;
0	1.22999999999999998	2017-10-09	c:\\\\asdfdsafasdf	15	f	t
1	1.22999999999999998	2017-10-09	c:\\\\gfhjfhfhjgfhj	13	f	t
2	1.22999999999999998	2017-10-10	c:\\\\gfhjfhfhjgfhjasdfasdf	15	f	t
3	1.22999999999999998	2017-10-10	c:\\\\gfhjghmjrtws	14	f	t
4	1.22999999999999998	2017-10-10	c:\\\\gfhhtrthrtfgsdf	12	f	t
5	1.22999999999999998	2017-10-10	c:\\\\gfhjfhfhhhhh	15	f	t
6	1.22999999999999998	2017-10-10	c:\\\\gfhjfhmmymyr	14	f	t
7	1.22999999999999998	2017-10-11	c:\\\\gfhjktjyjrddd	12	f	t
8	1.22999999999999998	2017-10-11	c:\\\\gfhjfhfhjgfhjfsdsdf	15	f	t
\.


--
-- Name: asp_user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY asp_users
    ADD CONSTRAINT asp_user_pkey PRIMARY KEY (user_id);


--
-- Name: asp_users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY asp_users
    ADD CONSTRAINT asp_users_email_key UNIQUE (email);


--
-- Name: filter_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY filters
    ADD CONSTRAINT filter_pkey PRIMARY KEY (filter_id);


--
-- Name: paid_users_pkey; Type: CONSTRAINT; Schema: public; Owner: administrator; Tablespace: 
--

ALTER TABLE ONLY paid_users
    ADD CONSTRAINT paid_users_pkey PRIMARY KEY (user_id);


--
-- Name: photo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY photos
    ADD CONSTRAINT photo_pkey PRIMARY KEY (photo_id);


--
-- Name: stat_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY stat_types
    ADD CONSTRAINT stat_type_pkey PRIMARY KEY (stat_id);


--
-- Name: unfiltered_photo_pkey; Type: CONSTRAINT; Schema: public; Owner: administrator; Tablespace: 
--

ALTER TABLE ONLY unfiltered_photo
    ADD CONSTRAINT unfiltered_photo_pkey PRIMARY KEY (unfiltered_photo_id);


--
-- Name: unfiltered_video_pkey; Type: CONSTRAINT; Schema: public; Owner: administrator; Tablespace: 
--

ALTER TABLE ONLY unfiltered_video
    ADD CONSTRAINT unfiltered_video_pkey PRIMARY KEY (unfiltered_video_id);


--
-- Name: usage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY usage
    ADD CONSTRAINT usage_pkey PRIMARY KEY (user_id, "timestamp");


--
-- Name: user_photo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY user_photo
    ADD CONSTRAINT user_photo_pkey PRIMARY KEY (user_id, photo_id);


--
-- Name: user_video_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY user_video
    ADD CONSTRAINT user_video_pkey PRIMARY KEY (user_id, video_id);


--
-- Name: video_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY videos
    ADD CONSTRAINT video_pkey PRIMARY KEY (video_id);


--
-- Name: paid_users_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: administrator
--

ALTER TABLE ONLY paid_users
    ADD CONSTRAINT paid_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES asp_users(user_id);


--
-- Name: usage_stat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY usage
    ADD CONSTRAINT usage_stat_id_fkey FOREIGN KEY (stat_id) REFERENCES stat_types(stat_id);


--
-- Name: usage_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY usage
    ADD CONSTRAINT usage_user_id_fkey FOREIGN KEY (user_id) REFERENCES asp_users(user_id);


--
-- Name: user_photo_filter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY user_photo
    ADD CONSTRAINT user_photo_filter_id_fkey FOREIGN KEY (filter_id) REFERENCES filters(filter_id);


--
-- Name: user_photo_photo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY user_photo
    ADD CONSTRAINT user_photo_photo_id_fkey FOREIGN KEY (photo_id) REFERENCES photos(photo_id);


--
-- Name: user_photo_unfiltered_photo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY user_photo
    ADD CONSTRAINT user_photo_unfiltered_photo_id_fkey FOREIGN KEY (unfiltered_photo_id) REFERENCES unfiltered_photo(unfiltered_photo_id);


--
-- Name: user_photo_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY user_photo
    ADD CONSTRAINT user_photo_user_id_fkey FOREIGN KEY (user_id) REFERENCES asp_users(user_id);


--
-- Name: user_video_filter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY user_video
    ADD CONSTRAINT user_video_filter_id_fkey FOREIGN KEY (filter_id) REFERENCES filters(filter_id);


--
-- Name: user_video_unfiltered_video_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY user_video
    ADD CONSTRAINT user_video_unfiltered_video_id_fkey FOREIGN KEY (unfiltered_video_id) REFERENCES unfiltered_video(unfiltered_video_id);


--
-- Name: user_video_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY user_video
    ADD CONSTRAINT user_video_user_id_fkey FOREIGN KEY (user_id) REFERENCES asp_users(user_id);


--
-- Name: user_video_video_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY user_video
    ADD CONSTRAINT user_video_video_id_fkey FOREIGN KEY (video_id) REFERENCES videos(video_id);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO wsadmin;
GRANT USAGE ON SCHEMA public TO wsuser;
GRANT USAGE ON SCHEMA public TO wsnonuser;


--
-- Name: user_id_seq; Type: ACL; Schema: public; Owner: administrator
--

REVOKE ALL ON SEQUENCE user_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE user_id_seq FROM administrator;
GRANT ALL ON SEQUENCE user_id_seq TO administrator;
GRANT SELECT,USAGE ON SEQUENCE user_id_seq TO wsadmin;


--
-- Name: asp_users; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE asp_users FROM PUBLIC;
REVOKE ALL ON TABLE asp_users FROM postgres;
GRANT ALL ON TABLE asp_users TO postgres;
GRANT ALL ON TABLE asp_users TO administrator WITH GRANT OPTION;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE asp_users TO wsadmin;
GRANT SELECT,INSERT,UPDATE ON TABLE asp_users TO wsuser;
GRANT SELECT ON TABLE asp_users TO wsnonuser;


--
-- Name: filter_id_seq; Type: ACL; Schema: public; Owner: administrator
--

REVOKE ALL ON SEQUENCE filter_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE filter_id_seq FROM administrator;
GRANT ALL ON SEQUENCE filter_id_seq TO administrator;


--
-- Name: filters; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE filters FROM PUBLIC;
REVOKE ALL ON TABLE filters FROM postgres;
GRANT ALL ON TABLE filters TO postgres;
GRANT ALL ON TABLE filters TO administrator WITH GRANT OPTION;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE filters TO wsadmin;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE filters TO wsuser;


--
-- Name: paid_users; Type: ACL; Schema: public; Owner: administrator
--

REVOKE ALL ON TABLE paid_users FROM PUBLIC;
GRANT ALL ON TABLE paid_users TO postgres;
GRANT SELECT ON TABLE paid_users TO wsnonuser;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE paid_users TO wsadmin;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE paid_users TO wsuser;


--
-- Name: photo_id_seq; Type: ACL; Schema: public; Owner: administrator
--

REVOKE ALL ON SEQUENCE photo_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE photo_id_seq FROM administrator;
GRANT ALL ON SEQUENCE photo_id_seq TO administrator;
GRANT SELECT,USAGE ON SEQUENCE photo_id_seq TO wsadmin;


--
-- Name: photos; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE photos FROM PUBLIC;
REVOKE ALL ON TABLE photos FROM postgres;
GRANT ALL ON TABLE photos TO postgres;
GRANT ALL ON TABLE photos TO administrator WITH GRANT OPTION;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE photos TO wsadmin;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE photos TO wsuser;
GRANT SELECT ON TABLE photos TO wsnonuser;


--
-- Name: stat_types; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE stat_types FROM PUBLIC;
REVOKE ALL ON TABLE stat_types FROM postgres;
GRANT ALL ON TABLE stat_types TO postgres;
GRANT ALL ON TABLE stat_types TO administrator WITH GRANT OPTION;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE stat_types TO wsadmin;
GRANT SELECT,INSERT ON TABLE stat_types TO wsuser;


--
-- Name: unfiltered_photo_id_seq; Type: ACL; Schema: public; Owner: administrator
--

REVOKE ALL ON SEQUENCE unfiltered_photo_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE unfiltered_photo_id_seq FROM administrator;
GRANT ALL ON SEQUENCE unfiltered_photo_id_seq TO administrator;


--
-- Name: unfiltered_photo; Type: ACL; Schema: public; Owner: administrator
--

REVOKE ALL ON TABLE unfiltered_photo FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE unfiltered_photo TO wsuser;
GRANT ALL ON TABLE unfiltered_photo TO postgres;
GRANT SELECT ON TABLE unfiltered_photo TO wsnonuser;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE unfiltered_photo TO wsadmin;


--
-- Name: unfiltered_video; Type: ACL; Schema: public; Owner: administrator
--

REVOKE ALL ON TABLE unfiltered_video FROM PUBLIC;
GRANT ALL ON TABLE unfiltered_video TO postgres;
GRANT SELECT ON TABLE unfiltered_video TO wsnonuser;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE unfiltered_video TO wsuser;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE unfiltered_video TO wsadmin;


--
-- Name: usage; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE usage FROM PUBLIC;
REVOKE ALL ON TABLE usage FROM postgres;
GRANT ALL ON TABLE usage TO postgres;
GRANT ALL ON TABLE usage TO administrator WITH GRANT OPTION;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE usage TO wsadmin;
GRANT SELECT ON TABLE usage TO wsuser;


--
-- Name: user_photo; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE user_photo FROM PUBLIC;
REVOKE ALL ON TABLE user_photo FROM postgres;
GRANT ALL ON TABLE user_photo TO postgres;
GRANT ALL ON TABLE user_photo TO administrator WITH GRANT OPTION;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE user_photo TO wsadmin;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE user_photo TO wsuser;
GRANT SELECT ON TABLE user_photo TO wsnonuser;


--
-- Name: user_video; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE user_video FROM PUBLIC;
REVOKE ALL ON TABLE user_video FROM postgres;
GRANT ALL ON TABLE user_video TO postgres;
GRANT ALL ON TABLE user_video TO administrator WITH GRANT OPTION;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE user_video TO wsadmin;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE user_video TO wsuser;
GRANT SELECT ON TABLE user_video TO wsnonuser;


--
-- Name: videos; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE videos FROM PUBLIC;
REVOKE ALL ON TABLE videos FROM postgres;
GRANT ALL ON TABLE videos TO postgres;
GRANT ALL ON TABLE videos TO administrator WITH GRANT OPTION;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE videos TO wsadmin;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE videos TO wsuser;
GRANT SELECT ON TABLE videos TO wsnonuser;


--
-- PostgreSQL database dump complete
--


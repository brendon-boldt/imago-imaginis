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
    paid_id integer NOT NULL
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
-- Name: unfiltered_video_id_seq; Type: SEQUENCE; Schema: public; Owner: administrator
--

CREATE SEQUENCE unfiltered_video_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.unfiltered_video_id_seq OWNER TO administrator;

--
-- Name: unfiltered_video; Type: TABLE; Schema: public; Owner: administrator; Tablespace: 
--

CREATE TABLE unfiltered_video (
    unfiltered_video_id integer DEFAULT nextval('unfiltered_video_id_seq'::regclass) NOT NULL,
    size integer NOT NULL,
    height integer NOT NULL,
    width integer NOT NULL,
    path character varying(255) NOT NULL
);


ALTER TABLE public.unfiltered_video OWNER TO administrator;

--
-- Name: usage_id_seq; Type: SEQUENCE; Schema: public; Owner: administrator
--

CREATE SEQUENCE usage_id_seq
    START WITH 2
    INCREMENT BY 1
    MINVALUE 0
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.usage_id_seq OWNER TO administrator;

--
-- Name: usage; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE usage (
    user_id integer,
    "timestamp" timestamp without time zone NOT NULL,
    stat_id integer NOT NULL,
    usage_id integer DEFAULT nextval('usage_id_seq'::regclass) NOT NULL
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
-- Name: video_id_seq; Type: SEQUENCE; Schema: public; Owner: administrator
--

CREATE SEQUENCE video_id_seq
    START WITH 9
    INCREMENT BY 1
    MINVALUE 9
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.video_id_seq OWNER TO administrator;

--
-- Name: videos; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE videos (
    video_id integer DEFAULT nextval('video_id_seq'::regclass) NOT NULL,
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
7	EXZACKLY	7	zachary.recolan1@marist.edu	da1547fe74144fbc16a3ea3ce11a18be6c19fed0e1e91b9c567d485b86f7baac	2017-10-10	t	\N	f
1	Pabloooo	Rivas	asfdajsoifdja	5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5	2017-10-09	t	\N	t
2	Leo	Keefe	leo.keefe@email.com	jehg79qe4q8gy9u3h4p598ehgrghwe8e5gywe9pgy5e8ew8rhure	2017-10-10	t	\N	f
3	Dennis	Murray	hipHipMurray@marist.edu	dff7qp34wiyrfg8foy3g4r7qpe9grgyghjdsfkqdapf	2017-10-10	t	\N	f
4	David	Yellen	david.yellen@marist.edu	sdfgqe7eilyggkh6ueoggile7is47rtafsrubgfjer	2017-10-10	t	\N	f
5	Jon	Butensky	jon.butensky@marist.edu	dfjkhgergqughqoghhugrkdhfgs8dhguerihl	2017-10-10	t	\N	f
6	Kai	Wong	kai.wong@marist.edu	fdghwfgwe5dtghdyjet7hr5645wysdhwrt556456w	2017-10-10	t	\N	f
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
37	Kai	WongIsHotWow	kwwong1597@gmail.com	f2c77f9dd927df4fe2521bdc1415e3dcbb28dc8d60bddb9a96c96b90b46c2f49	2017-11-06	t	/home/administrator/files/images/uploads/profile-1510179093632.jpg	\N
45	Pablo	Rivaswow	rivas@marist.edu	5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5	2017-11-08	t	/home/administrator/files/images/uploads/profile-1510182743029.jpg	\N
46	[object Object]	[object Object]	[object Object]	b28c94b2195c8ed259f0b415aaee3f39b0b2920a4537611499fa044956917a21	2017-11-14	t	\N	\N
47	asdfasdfa	asmdasmdoasmdofi	amsdifmsdf@mfaisdmf	688787d8ff144c502c7f5cffaafe2cc588d86079f9de88304c26b0cb99ce91c6	2017-11-14	t	\N	\N
48	asdf	asdf	yolo.swag@gmail.comsd	5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5	2017-11-14	t	\N	\N
51	new params	no inject pls	sdfsafsaf@dadsfs.com	82cc0e49032348e2f368c930cea4d1849abfd980d9c0892a3692ea7747fd20f3	2017-11-19	t	\N	\N
39	ssssss	tttttt	fdddddsfdsa@gmail.com	da1547fe74144fbc16a3ea3ce11a18be6c19fed0e1e91b9c567d485b86f7baac	2017-11-08	t	\N	\N
41	Pablo	Rivas	wowimsexy@gmail.com	5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5	2017-11-08	t	/home/administrator/files/images/uploads/profile-1510172909810.jpg	\N
33	Pablooooasfdsafdaasdfsadfsafd	Rivasfjoiqwejfoijdoi	asfdajsoifdjaw	5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5	2017-10-31	t	/home/administrator/files/images/uploads/profile-1510178831789.jpg	t
52	undefined	undefined	kai.wong1@marist.edu	f2c77f9dd927df4fe2521bdc1415e3dcbb28dc8d60bddb9a96c96b90b46c2f49	2017-11-27	t	\N	\N
42	Kaiaaa	Wong	kai.wong.hi@gmail.com	8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92	2017-11-08	t	/home/administrator/files/images/uploads/profile-1510176225726.jpg	\N
43	Kai	Wong	asdfasdfa@gmail.com	5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5	2017-11-08	t	\N	\N
44	Matthew A	Johnson	mattjohnson@marist.edu	5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5	2017-11-08	t	/home/administrator/files/images/uploads/profile-1510178342793.jpg	\N
\.


--
-- Name: filter_id_seq; Type: SEQUENCE SET; Schema: public; Owner: administrator
--

SELECT pg_catalog.setval('filter_id_seq', 22, true);


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
22	33	/home/administrator/files/images/filters/filter-22.jpg	f
\.


--
-- Data for Name: paid_users; Type: TABLE DATA; Schema: public; Owner: administrator
--

COPY paid_users (paid_id) FROM stdin;
21
7
2
\.


--
-- Name: photo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: administrator
--

SELECT pg_catalog.setval('photo_id_seq', 136, true);


--
-- Data for Name: photos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY photos (photo_id, size, creation_date, path, process_time, flag, display, height, width) FROM stdin;
133	1.00000000000000002e-08	1970-01-01	/home/administrator/files/images/outputs/output-133.jpg	0	f	f	0	0
134	1.00000000000000002e-08	1970-01-01		0	f	f	0	0
135	1.00000000000000002e-08	1970-01-01	/home/administrator/files/images/outputs/output-135.jpg	0	f	f	0	0
117	1.00000000000000002e-08	1970-01-01	/home/administrator/files/images/outputs/output-117.jpg	0	f	t	0	0
118	1.00000000000000002e-08	1970-01-01	/home/administrator/files/images/outputs/output-118.jpg	0	f	t	0	0
112	1.00000000000000002e-08	1970-01-01	/home/administrator/files/images/outputs/output-112.jpg	0	f	t	0	0
109	1.00000000000000002e-08	1970-01-01	/home/administrator/files/images/outputs/output-109.jpg	0	f	f	0	0
120	1.00000000000000002e-08	1970-01-01	/home/administrator/files/images/outputs/output-120.jpg	0	f	f	0	0
130	1.00000000000000002e-08	1970-01-01	/home/administrator/files/images/outputs/output-130.jpg	0	f	t	0	0
107	1.00000000000000002e-08	1970-01-01	/home/administrator/files/images/outputs/output-107.png	0	f	f	0	0
114	1.00000000000000002e-08	1970-01-01	/home/administrator/files/images/outputs/output-114.jpg	0	f	f	0	0
108	1.00000000000000002e-08	1970-01-01	/home/administrator/files/images/outputs/output-108.jpg	0	f	f	0	0
116	1.00000000000000002e-08	1970-01-01	/home/administrator/files/images/outputs/output-116.jpg	0	f	t	0	0
115	1.00000000000000002e-08	1970-01-01	/home/administrator/files/images/outputs/output-115.jpg	0	f	f	0	0
113	1.00000000000000002e-08	1970-01-01	/home/administrator/files/images/outputs/output-113.jpg	0	f	t	0	0
111	1.00000000000000002e-08	1970-01-01		0	f	f	0	0
122	1.00000000000000002e-08	1970-01-01	/home/administrator/files/images/outputs/output-122.jpg	0	f	f	0	0
136	1.00000000000000002e-08	1970-01-01	/home/administrator/files/images/outputs/output-136.jpg	0	f	t	0	0
123	1.00000000000000002e-08	1970-01-01	/home/administrator/files/images/outputs/output-123.jpg	0	f	f	0	0
132	1.00000000000000002e-08	2017-11-18	/home/administrator/files/images/outputs/output-132.jpg	0	t	f	0	0
124	1.00000000000000002e-08	1970-01-01	/home/administrator/files/images/outputs/output-124.jpg	0	f	f	0	0
125	1.00000000000000002e-08	1970-01-01	/home/administrator/files/images/outputs/output-125.jpg	0	f	f	0	0
106	1.00000000000000002e-08	1970-01-01	/home/administrator/files/images/outputs/output-106.jpg	0	t	f	0	0
126	1.00000000000000002e-08	1970-01-01	/home/administrator/files/images/outputs/output-126.jpg	0	f	f	0	0
127	1.00000000000000002e-08	1970-01-01	/home/administrator/files/images/outputs/output-127.jpg	0	f	f	0	0
128	1.00000000000000002e-08	1970-01-01		0	f	f	0	0
129	1.00000000000000002e-08	1970-01-01	/home/administrator/files/images/outputs/output-129.jpg	0	f	f	0	0
131	1.00000000000000002e-08	1970-01-01	/home/administrator/files/images/outputs/output-131.jpg	0	f	f	0	0
\.


--
-- Data for Name: stat_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY stat_types (stat_id, stat_name) FROM stdin;
0	Login
1	Upload
\.


--
-- Data for Name: unfiltered_photo; Type: TABLE DATA; Schema: public; Owner: administrator
--

COPY unfiltered_photo (unfiltered_photo_id, size, height, width, path) FROM stdin;
41	120578	300	293	/home/administrator/files/images/uploads/upload-41.jpg
42	153609	1140	656	/home/administrator/files/images/uploads/upload-42.jpg
43	17387	300	233	/home/administrator/files/images/uploads/upload-43.jpg
44	29604	270	360	/home/administrator/files/images/uploads/upload-44.jpg
45	17387	300	233	/home/administrator/files/images/uploads/upload-45.jpg
46	120578	300	293	/home/administrator/files/images/uploads/upload-46.png
47	120578	300	293	/home/administrator/files/images/uploads/upload-47.jpg
48	56034	1280	720	/home/administrator/files/images/uploads/upload-48.jpg
49	29604	270	360	/home/administrator/files/images/uploads/upload-49.jpg
50	56034	1280	720	/home/administrator/files/images/uploads/upload-50.jpg
51	56034	1280	720	/home/administrator/files/images/uploads/upload-51.jpg
52	17387	300	233	/home/administrator/files/images/uploads/upload-52.jpg
53	29604	270	360	/home/administrator/files/images/uploads/upload-53.jpg
54	414993	505	399	/home/administrator/files/images/uploads/upload-54.jpg
55	56034	1280	720	/home/administrator/files/images/uploads/upload-55.jpg
56	56034	1280	720	/home/administrator/files/images/uploads/upload-56.jpg
57	414993	505	399	/home/administrator/files/images/uploads/upload-57.jpg
58	17387	300	233	/home/administrator/files/images/uploads/upload-58.jpg
59	414993	505	399	/home/administrator/files/images/uploads/upload-59.jpg
60	17387	300	233	/home/administrator/files/images/uploads/upload-60.jpg
61	613563	1280	1014	/home/administrator/files/images/uploads/upload-61.jpg
62	0	264	264	
63	0	264	264	
64	0	264	264	
65	0	264	264	
66	0	264	264	
67	0	264	264	
68	374417	1536	2048	/home/administrator/files/images/uploads/upload-68.jpg
69	0	264	264	
70	34592	623	501	/home/administrator/files/images/uploads/upload-70.png
71	411336	791	792	/home/administrator/files/images/uploads/upload-71.jpg
72	0	264	264	
73	0	264	264	
74	0	264	264	
75	0	264	264	
76	0	264	264	
77	3033227	4128	2322	/home/administrator/files/images/uploads/upload-77.jpg
78	411336	791	792	/home/administrator/files/images/uploads/upload-78.jpg
79	0	264	264	
80	0	264	264	
81	0	264	264	
82	0	264	264	
83	0	264	264	
84	0	264	264	
85	0	264	264	
86	0	264	264	
87	0	264	264	
88	56034	1280	720	/home/administrator/files/images/uploads/upload-88.jpg
89	414993	505	399	/home/administrator/files/images/uploads/upload-89.jpg
90	9759	1200	600	/home/administrator/files/images/uploads/upload-90.png
91	1033076	1017	605	/home/administrator/files/images/uploads/upload-91.jpg
92	0	264	264	
93	17387	300	233	/home/administrator/files/images/uploads/upload-93.jpg
94	0	264	264	
95	0	264	264	
96	0	264	264	
97	0	264	264	
98	0	264	264	
99	0	264	264	
\.


--
-- Name: unfiltered_photo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: administrator
--

SELECT pg_catalog.setval('unfiltered_photo_id_seq', 99, true);


--
-- Data for Name: unfiltered_video; Type: TABLE DATA; Schema: public; Owner: administrator
--

COPY unfiltered_video (unfiltered_video_id, size, height, width, path) FROM stdin;
0	500	10	10	\\aspdb
3	0	264	264	
4	0	264	264	
5	0	264	264	
6	0	264	264	
7	0	264	264	
8	2538002	0	0	/home/administrator/files/videos/uploads/upload-8.mp4
9	2538002	0	0	/home/administrator/files/videos/uploads/upload-9.mp4
10	2538002	0	0	/home/administrator/files/videos/uploads/upload-10.mp4
\.


--
-- Name: unfiltered_video_id_seq; Type: SEQUENCE SET; Schema: public; Owner: administrator
--

SELECT pg_catalog.setval('unfiltered_video_id_seq', 10, true);


--
-- Data for Name: usage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY usage (user_id, "timestamp", stat_id, usage_id) FROM stdin;
2	2017-10-09 00:00:00	0	0
4	2017-11-07 19:29:15.800637	1	1
3	2017-11-16 23:13:58.049646	1	2
\.


--
-- Name: usage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: administrator
--

SELECT pg_catalog.setval('usage_id_seq', 2, true);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: administrator
--

SELECT pg_catalog.setval('user_id_seq', 52, true);


--
-- Data for Name: user_photo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY user_photo (user_id, photo_id, filter_id, status, wait_time, unfiltered_photo_id) FROM stdin;
33	122	2	done	0	57
33	123	2	done	0	58
33	106	1	done	0	41
33	124	1	done	0	59
33	125	3	done	0	60
33	126	1	done	0	61
33	127	2	done	0	68
33	129	3	done	0	71
33	130	0	done	0	77
33	131	1	done	0	78
33	132	3	done	0	88
33	133	2	done	0	89
33	135	1	done	0	91
33	136	0	done	0	93
37	117	3	done	0	52
45	118	2	done	0	53
33	108	1	done	0	43
41	112	4	done	0	47
33	109	0	done	0	44
33	120	3	done	0	55
33	107	3	done	0	46
33	114	3	done	0	49
44	116	1	done	0	51
33	115	2	done	0	50
42	113	2	done	0	48
\.


--
-- Data for Name: user_video; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY user_video (user_id, video_id, filter_id, status, wait_time, unfiltered_video_id) FROM stdin;
33	9	1	done	0	10
33	10	1	done	0	10
\.


--
-- Name: video_id_seq; Type: SEQUENCE SET; Schema: public; Owner: administrator
--

SELECT pg_catalog.setval('video_id_seq', 10, true);


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
9	1.00000000000000002e-08	1970-01-01	/home/administrator/files/videos/uploads/upload-10.mp4	0	f	f
10	9.99999999999999955e-08	1970-01-01	/home/administrator/files/videos/uploads/upload-10.mp4	0	f	t
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
    ADD CONSTRAINT paid_users_pkey PRIMARY KEY (paid_id);


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
    ADD CONSTRAINT usage_pkey PRIMARY KEY (usage_id);


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
    ADD CONSTRAINT paid_users_user_id_fkey FOREIGN KEY (paid_id) REFERENCES asp_users(user_id);


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
-- Name: unfiltered_video_id_seq; Type: ACL; Schema: public; Owner: administrator
--

REVOKE ALL ON SEQUENCE unfiltered_video_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE unfiltered_video_id_seq FROM administrator;
GRANT ALL ON SEQUENCE unfiltered_video_id_seq TO administrator;


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
-- Name: video_id_seq; Type: ACL; Schema: public; Owner: administrator
--

REVOKE ALL ON SEQUENCE video_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE video_id_seq FROM administrator;
GRANT ALL ON SEQUENCE video_id_seq TO administrator;


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


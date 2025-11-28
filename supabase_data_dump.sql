SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict ZPGeZ2uZ4f23yXPsvbFcqmEbDBXhIZH6duk0SdkjL1xXZpNgRKiSck63yHYPHXB

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

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
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at") VALUES
	('4fb8da51-7ff6-479c-919e-cbe22ef0645a', '4661a407-9b66-4e99-a421-bac2b5a9bcd5', 'c752cdf6-0c82-486e-9ddd-e723c9b7d295', 's256', 'a5ozODOSqd1xh4up5je0M3RMJL06kXw-L4Af254OEvY', 'email', '', '', '2025-11-27 12:41:54.030965+00', '2025-11-27 12:41:54.030965+00', 'email/signup', NULL),
	('462d5691-7f3d-42f6-9098-8fbee093ffc6', '09faf0dd-0974-43ea-af01-217e956b5b89', 'af8d1b65-df71-413f-a57f-f0fd9a829779', 's256', 'j7caRMvvLHXCHlwD3C3rFHzPnk5kP-8s-YjPBTcbpFI', 'email', '', '', '2025-11-27 12:59:20.288796+00', '2025-11-27 12:59:20.288796+00', 'email/signup', NULL),
	('5a776d21-5a2b-4484-8636-8369be9de58c', '99dec437-c106-4135-8ab9-69020933d3c5', 'f1eb3d61-74ec-4284-9b97-e20f92134df9', 's256', 'V229cDOcIQDzWFtCAyL2dGHyDxiasXFtgZI8j53SYy8', 'email', '', '', '2025-11-27 13:00:58.272329+00', '2025-11-27 13:03:23.027884+00', 'email/signup', '2025-11-27 13:03:23.027846+00'),
	('b3cfbcb9-c257-41f2-b55e-53ef29a0d560', '1edd3b4b-09a4-4a3d-a729-0a434ed4ee40', 'ac9c42d2-758f-438e-b62e-a654c389f302', 's256', 'tZ6BcxXC6Owbt20NBUIkM_PGsmWUl6Q-N-64Xyj_Xn8', 'email', '', '', '2025-11-27 13:01:31.508663+00', '2025-11-27 13:04:17.684248+00', 'email/signup', '2025-11-27 13:04:17.68421+00'),
	('affa7b20-ac17-488b-8009-69308addd858', 'b73130c7-9d50-4392-9145-3edfc4a27aba', '84228253-9778-44f5-89fb-4fafe82b1722', 's256', 'FoNc1p0NVI4DqbaXaq9QY3QJqYLZcjWVXKEuj1C7Gpo', 'email', '', '', '2025-11-27 13:01:18.777144+00', '2025-11-27 13:10:08.935316+00', 'email/signup', '2025-11-27 13:10:08.935276+00'),
	('393d69c0-e745-47ce-90bc-e17be7c26981', '89038196-d5cb-4e87-af13-9a92cf51c6c5', 'ab66cad3-143e-497b-9e2f-a329fec86790', 's256', 'CwJma3uE1XeMaXuzq1HCH35QavbrYruEZafoIDduFNA', 'recovery', '', '', '2025-11-27 13:44:56.359023+00', '2025-11-27 13:45:10.934374+00', 'recovery', '2025-11-27 13:45:10.934328+00'),
	('6a8c8af5-8fe8-48a2-9fe5-09f6bc3525d8', '89038196-d5cb-4e87-af13-9a92cf51c6c5', 'c3ce9e33-8111-473b-8be6-289b26d06891', 's256', 'hGiWrsTfhBkzKz74FUIiGFZgN_2pj7KyL8cNpES-mKs', 'recovery', '', '', '2025-11-27 13:48:08.090265+00', '2025-11-27 13:48:19.607431+00', 'recovery', '2025-11-27 13:48:19.607388+00'),
	('33e3eed1-6867-425b-83b4-d87dd0dec9d5', '1edd3b4b-09a4-4a3d-a729-0a434ed4ee40', '44783c99-045e-4432-9434-0dca93900c33', 's256', 'N451ZanfBSIwqHt0iQXdDVqLY989KMciZ-ZlUGj1NGk', 'recovery', '', '', '2025-11-27 14:52:21.495024+00', '2025-11-27 14:52:58.697479+00', 'recovery', '2025-11-27 14:52:58.697429+00');


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', 'b73130c7-9d50-4392-9145-3edfc4a27aba', 'authenticated', 'authenticated', 'carlosbalbino@douravita.com.br', '$2a$10$Qr4jt.RtGEFGq4S.i2LVs.VU8jJrkI7g9JZzgTJPLvcSK4Dm.uumq', '2025-11-27 13:10:08.929184+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-11-27 14:41:34.255889+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "b73130c7-9d50-4392-9145-3edfc4a27aba", "email": "carlosbalbino@douravita.com.br", "full_name": "Carlos", "email_verified": true, "phone_verified": false}', NULL, '2025-11-27 13:01:18.772479+00', '2025-11-27 21:00:21.707002+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '99dec437-c106-4135-8ab9-69020933d3c5', 'authenticated', 'authenticated', 'feliperodrigues@douravita.com.br', '$2a$10$wB0Jn1JCyQHhur7Sq4UMOeDjNGOSWB1NGvd4nUEgyUKqyvDg9P8RC', '2025-11-27 13:03:23.02175+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-11-27 14:41:13.8135+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "99dec437-c106-4135-8ab9-69020933d3c5", "email": "feliperodrigues@douravita.com.br", "full_name": "Felipe", "email_verified": true, "phone_verified": false}', NULL, '2025-11-27 13:00:58.265671+00', '2025-11-27 17:54:55.322739+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '89038196-d5cb-4e87-af13-9a92cf51c6c5', 'authenticated', 'authenticated', 'ianfrancio@hotmail.com', '$2a$10$5H/Z2rw6.lX3TxsibQzJyeHPbrFaeie/YLRQUFLfSTVpsoxI2i3NG', '2025-11-25 22:56:41.469413+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-11-27 22:03:25.350439+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "89038196-d5cb-4e87-af13-9a92cf51c6c5", "email": "ianfrancio@hotmail.com", "uazapi_token": "d1b22891-eb2c-4233-9e3f-b911d656c117", "email_verified": true, "phone_verified": false, "uazapi_instance_id": "r2d05b0e3425312"}', NULL, '2025-11-25 22:56:20.013288+00', '2025-11-28 01:05:23.204281+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '09faf0dd-0974-43ea-af01-217e956b5b89', 'authenticated', 'authenticated', 'emily.evangelista@douravita.com.br', '$2a$10$WsCk7FUgwRMR0xqMZAXs6uS00yemDj8xrikWqRhsAxfg.L4.t.kue', '2025-11-27 14:49:20.425029+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-11-27 14:49:21.599376+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "09faf0dd-0974-43ea-af01-217e956b5b89", "email": "emily.evangelista@douravita.com.br", "full_name": "Emily", "email_verified": true, "phone_verified": false}', NULL, '2025-11-27 12:59:20.282957+00', '2025-11-27 18:18:46.962+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '1edd3b4b-09a4-4a3d-a729-0a434ed4ee40', 'authenticated', 'authenticated', 'leticia.cortez@douravita.com.br', '$2a$10$WDUSstbTdmLHTPEAkBC0GOzX3UfFNEUiejtiQ.4rg1Ug6t9E4FpS6', '2025-11-27 13:04:17.680525+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-11-27 14:54:48.719237+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "1edd3b4b-09a4-4a3d-a729-0a434ed4ee40", "email": "leticia.cortez@douravita.com.br", "full_name": "Leticia", "email_verified": true, "phone_verified": false}', NULL, '2025-11-27 13:01:31.503833+00', '2025-11-27 19:53:23.150083+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '4661a407-9b66-4e99-a421-bac2b5a9bcd5', 'authenticated', 'authenticated', 'ianfrancio@douravita.com.br', '$2a$10$IHo4tM7HFGn972Jw5ghP4ejXbYYC8WWTAnqw6oCl1r5Folwzogjy6', NULL, NULL, 'pkce_35368f7e18e68afaa852f4d2a8d1213fa3753f1bfa5e4fdd7dab212b', '2025-11-27 12:41:54.031967+00', '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"sub": "4661a407-9b66-4e99-a421-bac2b5a9bcd5", "email": "ianfrancio@douravita.com.br", "full_name": "ian", "email_verified": false, "phone_verified": false}', NULL, '2025-11-27 12:41:54.022277+00', '2025-11-27 12:41:54.477418+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('89038196-d5cb-4e87-af13-9a92cf51c6c5', '89038196-d5cb-4e87-af13-9a92cf51c6c5', '{"sub": "89038196-d5cb-4e87-af13-9a92cf51c6c5", "email": "ianfrancio@hotmail.com", "email_verified": true, "phone_verified": false}', 'email', '2025-11-25 22:56:20.025523+00', '2025-11-25 22:56:20.025576+00', '2025-11-25 22:56:20.025576+00', '3ab4dbe8-63bb-4ab6-a3b9-a9acc7432260'),
	('4661a407-9b66-4e99-a421-bac2b5a9bcd5', '4661a407-9b66-4e99-a421-bac2b5a9bcd5', '{"sub": "4661a407-9b66-4e99-a421-bac2b5a9bcd5", "email": "ianfrancio@douravita.com.br", "full_name": "ian", "email_verified": false, "phone_verified": false}', 'email', '2025-11-27 12:41:54.026854+00', '2025-11-27 12:41:54.026911+00', '2025-11-27 12:41:54.026911+00', 'c86cd7cd-c2da-4746-b441-c428022b721f'),
	('09faf0dd-0974-43ea-af01-217e956b5b89', '09faf0dd-0974-43ea-af01-217e956b5b89', '{"sub": "09faf0dd-0974-43ea-af01-217e956b5b89", "email": "emily.evangelista@douravita.com.br", "full_name": "Emily", "email_verified": false, "phone_verified": false}', 'email', '2025-11-27 12:59:20.286162+00', '2025-11-27 12:59:20.28621+00', '2025-11-27 12:59:20.28621+00', '510b2685-e0e2-4376-9330-8a19470fc2c8'),
	('99dec437-c106-4135-8ab9-69020933d3c5', '99dec437-c106-4135-8ab9-69020933d3c5', '{"sub": "99dec437-c106-4135-8ab9-69020933d3c5", "email": "feliperodrigues@douravita.com.br", "full_name": "Felipe", "email_verified": true, "phone_verified": false}', 'email', '2025-11-27 13:00:58.269479+00', '2025-11-27 13:00:58.269529+00', '2025-11-27 13:00:58.269529+00', '9b8b8e6e-21eb-445d-b4f5-b651cdc1662c'),
	('1edd3b4b-09a4-4a3d-a729-0a434ed4ee40', '1edd3b4b-09a4-4a3d-a729-0a434ed4ee40', '{"sub": "1edd3b4b-09a4-4a3d-a729-0a434ed4ee40", "email": "leticia.cortez@douravita.com.br", "full_name": "Leticia", "email_verified": true, "phone_verified": false}', 'email', '2025-11-27 13:01:31.506276+00', '2025-11-27 13:01:31.506321+00', '2025-11-27 13:01:31.506321+00', 'dea8d86b-77ef-4ee9-a3e3-e4245eb8110e'),
	('b73130c7-9d50-4392-9145-3edfc4a27aba', 'b73130c7-9d50-4392-9145-3edfc4a27aba', '{"sub": "b73130c7-9d50-4392-9145-3edfc4a27aba", "email": "carlosbalbino@douravita.com.br", "full_name": "Carlos", "email_verified": true, "phone_verified": false}', 'email', '2025-11-27 13:01:18.774918+00', '2025-11-27 13:01:18.774963+00', '2025-11-27 13:01:18.774963+00', 'a11f09a9-e82f-4fd4-bb14-7c11858d3132');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") VALUES
	('6676ddd7-c0be-4feb-8c2d-2e6321273224', '89038196-d5cb-4e87-af13-9a92cf51c6c5', '2025-11-27 17:04:11.649495+00', '2025-11-27 17:04:11.649495+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '181.216.46.85', NULL, NULL, NULL, NULL, NULL),
	('2ac85239-0c56-40f2-a3c5-9ec7bbdb131d', '89038196-d5cb-4e87-af13-9a92cf51c6c5', '2025-11-27 17:12:03.779484+00', '2025-11-27 17:12:03.779484+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '181.216.46.85', NULL, NULL, NULL, NULL, NULL),
	('6efbbd44-2c3a-4094-b937-d3778c8a76b7', '89038196-d5cb-4e87-af13-9a92cf51c6c5', '2025-11-27 14:39:33.797256+00', '2025-11-27 17:52:13.791445+00', NULL, 'aal1', NULL, '2025-11-27 17:52:13.791354', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '181.216.46.85', NULL, NULL, NULL, NULL, NULL),
	('161e5d3c-25ec-452f-9be8-2efd01b320e8', '99dec437-c106-4135-8ab9-69020933d3c5', '2025-11-27 14:41:13.813588+00', '2025-11-27 17:54:55.324305+00', NULL, 'aal1', NULL, '2025-11-27 17:54:55.324134', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '189.38.209.72', NULL, NULL, NULL, NULL, NULL),
	('a2a677c6-c28d-4b46-8b55-4528b8951b6d', '09faf0dd-0974-43ea-af01-217e956b5b89', '2025-11-27 14:49:21.599486+00', '2025-11-27 18:18:46.963676+00', NULL, 'aal1', NULL, '2025-11-27 18:18:46.963573', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '170.83.152.165', NULL, NULL, NULL, NULL, NULL),
	('83ea2147-6ccd-4d6e-9e50-dd6d148400e0', '89038196-d5cb-4e87-af13-9a92cf51c6c5', '2025-11-27 18:34:20.959883+00', '2025-11-27 18:34:20.959883+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '181.216.46.85', NULL, NULL, NULL, NULL, NULL),
	('79e30854-6ebb-4783-9142-4074ba878648', '1edd3b4b-09a4-4a3d-a729-0a434ed4ee40', '2025-11-27 14:54:48.719334+00', '2025-11-27 19:53:23.151507+00', NULL, 'aal1', NULL, '2025-11-27 19:53:23.151397', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '179.247.138.126', NULL, NULL, NULL, NULL, NULL),
	('bcd801b3-8f24-4fa1-b0da-9eb4f64ffd18', 'b73130c7-9d50-4392-9145-3edfc4a27aba', '2025-11-27 14:41:34.255984+00', '2025-11-27 21:00:21.708557+00', NULL, 'aal1', NULL, '2025-11-27 21:00:21.708442', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '45.174.5.71', NULL, NULL, NULL, NULL, NULL),
	('0ea4eee3-e793-48eb-bba1-c33bf9e89553', '89038196-d5cb-4e87-af13-9a92cf51c6c5', '2025-11-27 21:56:29.679873+00', '2025-11-27 21:56:29.679873+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '181.216.46.85', NULL, NULL, NULL, NULL, NULL),
	('3eed5236-d3d3-4b6b-bcf8-5676b5a8bfc7', '89038196-d5cb-4e87-af13-9a92cf51c6c5', '2025-11-27 15:39:06.377095+00', '2025-11-27 16:58:56.28535+00', NULL, 'aal1', NULL, '2025-11-27 16:58:56.285244', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '181.216.46.85', NULL, NULL, NULL, NULL, NULL),
	('c8dde871-2813-43df-a08e-edf4b0044cf0', '89038196-d5cb-4e87-af13-9a92cf51c6c5', '2025-11-27 18:37:20.980183+00', '2025-11-27 23:29:28.867907+00', NULL, 'aal1', NULL, '2025-11-27 23:29:28.867811', 'Next.js Middleware', '181.216.46.85', NULL, NULL, NULL, NULL, NULL),
	('2c11fedf-d2b0-4a82-91e0-8aa4319e1f83', '89038196-d5cb-4e87-af13-9a92cf51c6c5', '2025-11-27 22:03:25.350584+00', '2025-11-28 01:05:23.206076+00', NULL, 'aal1', NULL, '2025-11-28 01:05:23.205934', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '181.216.46.85', NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('6efbbd44-2c3a-4094-b937-d3778c8a76b7', '2025-11-27 14:39:33.800446+00', '2025-11-27 14:39:33.800446+00', 'recovery', 'f3844809-20f9-45c1-bb28-2cb35dfb2bff'),
	('161e5d3c-25ec-452f-9be8-2efd01b320e8', '2025-11-27 14:41:13.81575+00', '2025-11-27 14:41:13.81575+00', 'recovery', '4e664c4e-5246-41a1-b586-c1d5c80c0599'),
	('bcd801b3-8f24-4fa1-b0da-9eb4f64ffd18', '2025-11-27 14:41:34.258174+00', '2025-11-27 14:41:34.258174+00', 'recovery', '6e183ae9-b018-46c8-a91b-61fe03ddc5df'),
	('a2a677c6-c28d-4b46-8b55-4528b8951b6d', '2025-11-27 14:49:21.602838+00', '2025-11-27 14:49:21.602838+00', 'recovery', '016bcaef-c9aa-46de-9eb8-6641d506c956'),
	('79e30854-6ebb-4783-9142-4074ba878648', '2025-11-27 14:54:48.721715+00', '2025-11-27 14:54:48.721715+00', 'recovery', 'bd27b4aa-8ace-4118-80be-af9d5a181bd9'),
	('3eed5236-d3d3-4b6b-bcf8-5676b5a8bfc7', '2025-11-27 15:39:06.380421+00', '2025-11-27 15:39:06.380421+00', 'password', '7da9227b-8e19-435a-8d85-bc09659fa33b'),
	('6676ddd7-c0be-4feb-8c2d-2e6321273224', '2025-11-27 17:04:11.652459+00', '2025-11-27 17:04:11.652459+00', 'password', 'fe3bdeea-19df-4cd7-b0f1-28ae85ccb657'),
	('2ac85239-0c56-40f2-a3c5-9ec7bbdb131d', '2025-11-27 17:12:03.78199+00', '2025-11-27 17:12:03.78199+00', 'password', '54dd5701-ca91-4ea9-97ea-53aedc974fb8'),
	('83ea2147-6ccd-4d6e-9e50-dd6d148400e0', '2025-11-27 18:34:20.963863+00', '2025-11-27 18:34:20.963863+00', 'password', 'beebfb95-e67c-405e-9952-51768cad3002'),
	('c8dde871-2813-43df-a08e-edf4b0044cf0', '2025-11-27 18:37:20.982776+00', '2025-11-27 18:37:20.982776+00', 'password', '681786aa-c083-499c-8f3b-55d95b3e2bb3'),
	('0ea4eee3-e793-48eb-bba1-c33bf9e89553', '2025-11-27 21:56:29.683792+00', '2025-11-27 21:56:29.683792+00', 'password', '3ba65eb6-0f85-4367-989a-92eb716acc7d'),
	('2c11fedf-d2b0-4a82-91e0-8aa4319e1f83', '2025-11-27 22:03:25.354381+00', '2025-11-27 22:03:25.354381+00', 'password', '84840896-f651-46f6-bdfe-f9176ccbfaed');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."one_time_tokens" ("id", "user_id", "token_type", "token_hash", "relates_to", "created_at", "updated_at") VALUES
	('d53e7b92-7c1a-4279-bd3c-a5c4feb14310', '4661a407-9b66-4e99-a421-bac2b5a9bcd5', 'confirmation_token', 'pkce_35368f7e18e68afaa852f4d2a8d1213fa3753f1bfa5e4fdd7dab212b', 'ianfrancio@douravita.com.br', '2025-11-27 12:41:54.480041', '2025-11-27 12:41:54.480041');


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 60, 'hg5747t5lwr6', 'b73130c7-9d50-4392-9145-3edfc4a27aba', true, '2025-11-27 14:41:34.256915+00', '2025-11-27 17:03:59.802338+00', NULL, 'bcd801b3-8f24-4fa1-b0da-9eb4f64ffd18'),
	('00000000-0000-0000-0000-000000000000', 72, 'cwpvteprrtmq', '89038196-d5cb-4e87-af13-9a92cf51c6c5', false, '2025-11-27 17:04:11.651045+00', '2025-11-27 17:04:11.651045+00', NULL, '6676ddd7-c0be-4feb-8c2d-2e6321273224'),
	('00000000-0000-0000-0000-000000000000', 73, 'b7b5bnnranf2', '89038196-d5cb-4e87-af13-9a92cf51c6c5', false, '2025-11-27 17:12:03.780573+00', '2025-11-27 17:12:03.780573+00', NULL, '2ac85239-0c56-40f2-a3c5-9ec7bbdb131d'),
	('00000000-0000-0000-0000-000000000000', 67, 'm6zayhxomwz3', '89038196-d5cb-4e87-af13-9a92cf51c6c5', true, '2025-11-27 16:49:47.032536+00', '2025-11-27 17:52:13.787905+00', 'aomoguwmh472', '6efbbd44-2c3a-4094-b937-d3778c8a76b7'),
	('00000000-0000-0000-0000-000000000000', 74, 'gmg6r3dd5jil', '89038196-d5cb-4e87-af13-9a92cf51c6c5', false, '2025-11-27 17:52:13.788694+00', '2025-11-27 17:52:13.788694+00', 'm6zayhxomwz3', '6efbbd44-2c3a-4094-b937-d3778c8a76b7'),
	('00000000-0000-0000-0000-000000000000', 68, 'z7l3npkzujqu', '99dec437-c106-4135-8ab9-69020933d3c5', true, '2025-11-27 16:56:34.706819+00', '2025-11-27 17:54:55.320512+00', '6ohih3fwxwn7', '161e5d3c-25ec-452f-9be8-2efd01b320e8'),
	('00000000-0000-0000-0000-000000000000', 75, 'ddbvem5ldjhe', '99dec437-c106-4135-8ab9-69020933d3c5', false, '2025-11-27 17:54:55.32131+00', '2025-11-27 17:54:55.32131+00', 'z7l3npkzujqu', '161e5d3c-25ec-452f-9be8-2efd01b320e8'),
	('00000000-0000-0000-0000-000000000000', 71, 'ahs2pkchvva3', 'b73130c7-9d50-4392-9145-3edfc4a27aba', true, '2025-11-27 17:03:59.803187+00', '2025-11-27 18:03:21.933645+00', 'hg5747t5lwr6', 'bcd801b3-8f24-4fa1-b0da-9eb4f64ffd18'),
	('00000000-0000-0000-0000-000000000000', 61, 'qe2vr5af55uk', '09faf0dd-0974-43ea-af01-217e956b5b89', true, '2025-11-27 14:49:21.600855+00', '2025-11-27 18:18:46.95972+00', NULL, 'a2a677c6-c28d-4b46-8b55-4528b8951b6d'),
	('00000000-0000-0000-0000-000000000000', 77, 'jgf6ahqgauaa', '09faf0dd-0974-43ea-af01-217e956b5b89', false, '2025-11-27 18:18:46.960596+00', '2025-11-27 18:18:46.960596+00', 'qe2vr5af55uk', 'a2a677c6-c28d-4b46-8b55-4528b8951b6d'),
	('00000000-0000-0000-0000-000000000000', 66, 'afvya6yjsyv4', '1edd3b4b-09a4-4a3d-a729-0a434ed4ee40', true, '2025-11-27 16:12:07.227448+00', '2025-11-27 18:26:30.183974+00', '72wpxxlshkgj', '79e30854-6ebb-4783-9142-4074ba878648'),
	('00000000-0000-0000-0000-000000000000', 79, 'be7w4l5edemf', '89038196-d5cb-4e87-af13-9a92cf51c6c5', false, '2025-11-27 18:34:20.961754+00', '2025-11-27 18:34:20.961754+00', NULL, '83ea2147-6ccd-4d6e-9e50-dd6d148400e0'),
	('00000000-0000-0000-0000-000000000000', 80, 'i6f5nmhq644i', '89038196-d5cb-4e87-af13-9a92cf51c6c5', true, '2025-11-27 18:37:20.981456+00', '2025-11-27 19:00:31.906134+00', NULL, 'c8dde871-2813-43df-a08e-edf4b0044cf0'),
	('00000000-0000-0000-0000-000000000000', 76, 'tcl3bizbut73', 'b73130c7-9d50-4392-9145-3edfc4a27aba', true, '2025-11-27 18:03:21.935042+00', '2025-11-27 19:02:22.024077+00', 'ahs2pkchvva3', 'bcd801b3-8f24-4fa1-b0da-9eb4f64ffd18'),
	('00000000-0000-0000-0000-000000000000', 81, 'rb25vij5qb4l', '89038196-d5cb-4e87-af13-9a92cf51c6c5', true, '2025-11-27 19:00:31.907206+00', '2025-11-27 19:03:48.319818+00', 'i6f5nmhq644i', 'c8dde871-2813-43df-a08e-edf4b0044cf0'),
	('00000000-0000-0000-0000-000000000000', 83, 'uzsh527jkrhl', '89038196-d5cb-4e87-af13-9a92cf51c6c5', true, '2025-11-27 19:03:48.320196+00', '2025-11-27 19:12:09.782943+00', 'rb25vij5qb4l', 'c8dde871-2813-43df-a08e-edf4b0044cf0'),
	('00000000-0000-0000-0000-000000000000', 59, 'w5v4422lej52', '99dec437-c106-4135-8ab9-69020933d3c5', true, '2025-11-27 14:41:13.814516+00', '2025-11-27 15:37:51.530694+00', NULL, '161e5d3c-25ec-452f-9be8-2efd01b320e8'),
	('00000000-0000-0000-0000-000000000000', 84, 'he5ub6gbhyww', '89038196-d5cb-4e87-af13-9a92cf51c6c5', true, '2025-11-27 19:12:09.783743+00', '2025-11-27 19:14:04.412235+00', 'uzsh527jkrhl', 'c8dde871-2813-43df-a08e-edf4b0044cf0'),
	('00000000-0000-0000-0000-000000000000', 58, 'agaxyghn5hce', '89038196-d5cb-4e87-af13-9a92cf51c6c5', true, '2025-11-27 14:39:33.798568+00', '2025-11-27 15:38:10.291131+00', NULL, '6efbbd44-2c3a-4094-b937-d3778c8a76b7'),
	('00000000-0000-0000-0000-000000000000', 85, '66k6i4sxsesr', '89038196-d5cb-4e87-af13-9a92cf51c6c5', true, '2025-11-27 19:14:04.412912+00', '2025-11-27 19:16:17.808631+00', 'he5ub6gbhyww', 'c8dde871-2813-43df-a08e-edf4b0044cf0'),
	('00000000-0000-0000-0000-000000000000', 86, 'kc7f4gpr7jcc', '89038196-d5cb-4e87-af13-9a92cf51c6c5', true, '2025-11-27 19:16:17.809359+00', '2025-11-27 19:19:04.215226+00', '66k6i4sxsesr', 'c8dde871-2813-43df-a08e-edf4b0044cf0'),
	('00000000-0000-0000-0000-000000000000', 62, '72wpxxlshkgj', '1edd3b4b-09a4-4a3d-a729-0a434ed4ee40', true, '2025-11-27 14:54:48.720306+00', '2025-11-27 16:12:07.226407+00', NULL, '79e30854-6ebb-4783-9142-4074ba878648'),
	('00000000-0000-0000-0000-000000000000', 64, 'aomoguwmh472', '89038196-d5cb-4e87-af13-9a92cf51c6c5', true, '2025-11-27 15:38:10.291534+00', '2025-11-27 16:49:47.031397+00', 'agaxyghn5hce', '6efbbd44-2c3a-4094-b937-d3778c8a76b7'),
	('00000000-0000-0000-0000-000000000000', 78, 'jqbef6n5gtx7', '1edd3b4b-09a4-4a3d-a729-0a434ed4ee40', true, '2025-11-27 18:26:30.1851+00', '2025-11-27 19:53:23.147807+00', 'afvya6yjsyv4', '79e30854-6ebb-4783-9142-4074ba878648'),
	('00000000-0000-0000-0000-000000000000', 63, '6ohih3fwxwn7', '99dec437-c106-4135-8ab9-69020933d3c5', true, '2025-11-27 15:37:51.531525+00', '2025-11-27 16:56:34.705727+00', 'w5v4422lej52', '161e5d3c-25ec-452f-9be8-2efd01b320e8'),
	('00000000-0000-0000-0000-000000000000', 88, 'uj4l6qam7yhs', '1edd3b4b-09a4-4a3d-a729-0a434ed4ee40', false, '2025-11-27 19:53:23.148884+00', '2025-11-27 19:53:23.148884+00', 'jqbef6n5gtx7', '79e30854-6ebb-4783-9142-4074ba878648'),
	('00000000-0000-0000-0000-000000000000', 82, '5gpjpt43e6ir', 'b73130c7-9d50-4392-9145-3edfc4a27aba', true, '2025-11-27 19:02:22.024912+00', '2025-11-27 20:01:21.679936+00', 'tcl3bizbut73', 'bcd801b3-8f24-4fa1-b0da-9eb4f64ffd18'),
	('00000000-0000-0000-0000-000000000000', 65, 'cms3akoops6c', '89038196-d5cb-4e87-af13-9a92cf51c6c5', true, '2025-11-27 15:39:06.378689+00', '2025-11-27 16:58:38.971822+00', NULL, '3eed5236-d3d3-4b6b-bcf8-5676b5a8bfc7'),
	('00000000-0000-0000-0000-000000000000', 89, 'pjrfqfeugvuz', 'b73130c7-9d50-4392-9145-3edfc4a27aba', true, '2025-11-27 20:01:21.680641+00', '2025-11-27 21:00:21.704462+00', '5gpjpt43e6ir', 'bcd801b3-8f24-4fa1-b0da-9eb4f64ffd18'),
	('00000000-0000-0000-0000-000000000000', 90, 'nqa6ltkzamol', 'b73130c7-9d50-4392-9145-3edfc4a27aba', false, '2025-11-27 21:00:21.705738+00', '2025-11-27 21:00:21.705738+00', 'pjrfqfeugvuz', 'bcd801b3-8f24-4fa1-b0da-9eb4f64ffd18'),
	('00000000-0000-0000-0000-000000000000', 69, 'r354nr5eauwi', '89038196-d5cb-4e87-af13-9a92cf51c6c5', true, '2025-11-27 16:58:38.972678+00', '2025-11-27 16:58:56.282677+00', 'cms3akoops6c', '3eed5236-d3d3-4b6b-bcf8-5676b5a8bfc7'),
	('00000000-0000-0000-0000-000000000000', 87, '4d7quqmpdtuu', '89038196-d5cb-4e87-af13-9a92cf51c6c5', true, '2025-11-27 19:19:04.215887+00', '2025-11-27 21:16:08.728755+00', 'kc7f4gpr7jcc', 'c8dde871-2813-43df-a08e-edf4b0044cf0'),
	('00000000-0000-0000-0000-000000000000', 70, 'cclizqrw7hwp', '89038196-d5cb-4e87-af13-9a92cf51c6c5', false, '2025-11-27 16:58:56.283132+00', '2025-11-27 16:58:56.283132+00', 'r354nr5eauwi', '3eed5236-d3d3-4b6b-bcf8-5676b5a8bfc7'),
	('00000000-0000-0000-0000-000000000000', 92, '5uka6gv65o4o', '89038196-d5cb-4e87-af13-9a92cf51c6c5', false, '2025-11-27 21:56:29.681889+00', '2025-11-27 21:56:29.681889+00', NULL, '0ea4eee3-e793-48eb-bba1-c33bf9e89553'),
	('00000000-0000-0000-0000-000000000000', 91, 'zvpejn2rr2bg', '89038196-d5cb-4e87-af13-9a92cf51c6c5', true, '2025-11-27 21:16:08.729534+00', '2025-11-27 22:17:46.023102+00', '4d7quqmpdtuu', 'c8dde871-2813-43df-a08e-edf4b0044cf0'),
	('00000000-0000-0000-0000-000000000000', 93, 'ovlto3ch65i5', '89038196-d5cb-4e87-af13-9a92cf51c6c5', true, '2025-11-27 22:03:25.35212+00', '2025-11-27 23:07:43.822801+00', NULL, '2c11fedf-d2b0-4a82-91e0-8aa4319e1f83'),
	('00000000-0000-0000-0000-000000000000', 94, 'zc3hutppw3ar', '89038196-d5cb-4e87-af13-9a92cf51c6c5', true, '2025-11-27 22:17:46.024422+00', '2025-11-27 23:29:28.864212+00', 'zvpejn2rr2bg', 'c8dde871-2813-43df-a08e-edf4b0044cf0'),
	('00000000-0000-0000-0000-000000000000', 96, 'dkddakv5jqbx', '89038196-d5cb-4e87-af13-9a92cf51c6c5', false, '2025-11-27 23:29:28.865057+00', '2025-11-27 23:29:28.865057+00', 'zc3hutppw3ar', 'c8dde871-2813-43df-a08e-edf4b0044cf0'),
	('00000000-0000-0000-0000-000000000000', 95, 'hwqov6qm2b2y', '89038196-d5cb-4e87-af13-9a92cf51c6c5', true, '2025-11-27 23:07:43.823866+00', '2025-11-28 00:06:23.325598+00', 'ovlto3ch65i5', '2c11fedf-d2b0-4a82-91e0-8aa4319e1f83'),
	('00000000-0000-0000-0000-000000000000', 97, 'ed7l2vfhn4fj', '89038196-d5cb-4e87-af13-9a92cf51c6c5', true, '2025-11-28 00:06:23.326887+00', '2025-11-28 01:05:23.201891+00', 'hwqov6qm2b2y', '2c11fedf-d2b0-4a82-91e0-8aa4319e1f83'),
	('00000000-0000-0000-0000-000000000000', 98, 'qkgclk6q62p7', '89038196-d5cb-4e87-af13-9a92cf51c6c5', false, '2025-11-28 01:05:23.202971+00', '2025-11-28 01:05:23.202971+00', 'ed7l2vfhn4fj', '2c11fedf-d2b0-4a82-91e0-8aa4319e1f83');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: agent_registrations; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: attendants; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: chatbot_ai_agents; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: chatbot_ai_functions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: chatbot_ai_knowledge; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: chatbot_triggers; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: chats; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."profiles" ("id", "full_name", "avatar_url", "role", "created_at", "updated_at") VALUES
	('89038196-d5cb-4e87-af13-9a92cf51c6c5', 'Ian Francio', NULL, 'admin', '2025-11-26 00:07:15.271103+00', '2025-11-26 00:07:15.271103+00');


--
-- Data for Name: contacts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."contacts" ("id", "created_at", "updated_at", "name", "email", "phone", "tags", "pipeline_stage", "owner_id", "metadata") VALUES
	('6c7d64f5-1c49-49c2-b47e-e5b7773e3bb3', '2025-11-26 00:07:20.935141+00', '2025-11-26 00:07:20.935141+00', 'Teste uazapi', NULL, '5511999999999', '{}', 'lead', '89038196-d5cb-4e87-af13-9a92cf51c6c5', '{}');


--
-- Data for Name: conversations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."conversations" ("id", "created_at", "updated_at", "contact_id", "channel", "status", "assigned_to", "last_message_at", "unread_count", "metadata", "user_id") VALUES
	('e1985f9a-4a77-4150-810d-b3eb3a2a19bd', '2025-11-26 00:07:39.810524+00', '2025-11-26 00:07:39.810524+00', '6c7d64f5-1c49-49c2-b47e-e5b7773e3bb3', 'whatsapp', 'open', '89038196-d5cb-4e87-af13-9a92cf51c6c5', '2025-11-26 00:07:39.810524+00', 0, '{}', '89038196-d5cb-4e87-af13-9a92cf51c6c5');


--
-- Data for Name: groups; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: group_participants; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: instances; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."instances" ("id", "token", "status", "paircode", "qrcode", "name", "profile_name", "profile_pic_url", "is_business", "plataform", "system_name", "owner", "last_disconnect", "last_disconnect_reason", "admin_field_01", "admin_field_02", "openai_apikey", "chatbot_enabled", "chatbot_ignore_groups", "chatbot_stop_conversation", "chatbot_stop_minutes", "chatbot_stop_when_you_send_msg", "msg_delay_min", "msg_delay_max", "user_id", "created_at", "updated_at") VALUES
	('r2d05b0e3425312', 'd1b22891-eb2c-4233-9e3f-b911d656c117', NULL, NULL, NULL, 'ianfrancio - CRM', NULL, NULL, false, NULL, 'uazapi', 'ianfrancio@hotmail.com', NULL, NULL, NULL, NULL, NULL, false, false, NULL, NULL, NULL, 2, 4, '89038196-d5cb-4e87-af13-9a92cf51c6c5', '2025-11-27 19:14:03.921089+00', '2025-11-27 21:19:09.564+00');


--
-- Data for Name: integrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."integrations" ("id", "created_at", "provider", "config", "status", "encrypted_credentials", "base_url", "instance_token", "admin_token", "user_id", "active") VALUES
	('ec958700-6cc9-43f5-af4c-41989a96da9d', '2025-11-26 00:04:58.751194+00', 'uazapi', '{"instance_id": "rb38b25ca6c5942", "instance_name": "ianfrancio-CRM"}', 'active', NULL, 'https://douravita.uazapi.com', '446c9edb-f242-4301-bce2-77a7b86281a9', 'KynGrON6iZJqgTHzJOHw1vp0pOoBVHMnkg9Zoj5nypZUBKUXy4', '89038196-d5cb-4e87-af13-9a92cf51c6c5', true);


--
-- Data for Name: labels; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: message_queue_folders; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: quick_replies; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: wa_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: webhook_events; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: webhooks; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id", "type") VALUES
	('attachments', 'attachments', NULL, '2025-11-25 22:14:41.884618+00', '2025-11-25 22:14:41.884618+00', true, false, NULL, NULL, NULL, 'STANDARD');


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 98, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict ZPGeZ2uZ4f23yXPsvbFcqmEbDBXhIZH6duk0SdkjL1xXZpNgRKiSck63yHYPHXB

RESET ALL;

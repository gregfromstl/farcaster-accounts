create table "public"."settings" (
    "user" text not null,
    "neynar_api_key" text
);


alter table "public"."settings" enable row level security;

CREATE UNIQUE INDEX settings_pkey ON public.settings USING btree ("user");

alter table "public"."settings" add constraint "settings_pkey" PRIMARY KEY using index "settings_pkey";




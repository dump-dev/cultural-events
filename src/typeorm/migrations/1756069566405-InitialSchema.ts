import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1756069566405 implements MigrationInterface {
    name = 'InitialSchema1756069566405'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "location" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "address" varchar NOT NULL, "city" varchar NOT NULL, "state" varchar NOT NULL, "country" varchar NOT NULL, "zip_code" varchar NOT NULL, "createatAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "like_cultural_event" ("user_id" varchar NOT NULL, "cultural_event_id" varchar NOT NULL, PRIMARY KEY ("user_id", "cultural_event_id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "authEmail" varchar NOT NULL, "password" varchar NOT NULL, "role" varchar CHECK( "role" IN ('user','organizer','admin') ) NOT NULL DEFAULT ('user'), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_6c2dfba07a95b1efd7cf7c16c63" UNIQUE ("authEmail"))`);
        await queryRunner.query(`CREATE TABLE "organizer" ("id" varchar PRIMARY KEY NOT NULL, "displayName" varchar NOT NULL, "description" varchar NOT NULL, "contacts" text, "userId" varchar, CONSTRAINT "REL_c804f867dbd19cc0cccd61a4a4" UNIQUE ("userId"))`);
        await queryRunner.query(`CREATE TABLE "cultural_event" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "date" datetime NOT NULL, "organizerId" varchar)`);
        await queryRunner.query(`CREATE TABLE "permission" ("name" varchar PRIMARY KEY NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "role_permission" ("role_name" varchar CHECK( "role_name" IN ('user','organizer','admin') ) NOT NULL, "permission_name" varchar CHECK( "permission_name" IN ('user:list','user:details','user:create','user:update','user:delete','like:details','like:cultural-event','unlike:cultural-event','organizer:list','organizer:details','organizer:create','organizer:update','organizer:delete','cultural-event:list','cultural-event:details','cultural-event:create','cultural-event:update','cultural-event:delete') ) NOT NULL, PRIMARY KEY ("role_name", "permission_name"))`);
        await queryRunner.query(`CREATE TABLE "temporary_like_cultural_event" ("user_id" varchar NOT NULL, "cultural_event_id" varchar NOT NULL, CONSTRAINT "FK_1ff5a2cba6b5331f797dc2763d2" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_f715425ea53af14565dd3cdf4b8" FOREIGN KEY ("cultural_event_id") REFERENCES "cultural_event" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, PRIMARY KEY ("user_id", "cultural_event_id"))`);
        await queryRunner.query(`INSERT INTO "temporary_like_cultural_event"("user_id", "cultural_event_id") SELECT "user_id", "cultural_event_id" FROM "like_cultural_event"`);
        await queryRunner.query(`DROP TABLE "like_cultural_event"`);
        await queryRunner.query(`ALTER TABLE "temporary_like_cultural_event" RENAME TO "like_cultural_event"`);
        await queryRunner.query(`CREATE TABLE "temporary_organizer" ("id" varchar PRIMARY KEY NOT NULL, "displayName" varchar NOT NULL, "description" varchar NOT NULL, "contacts" text, "userId" varchar, CONSTRAINT "REL_c804f867dbd19cc0cccd61a4a4" UNIQUE ("userId"), CONSTRAINT "FK_c804f867dbd19cc0cccd61a4a4c" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_organizer"("id", "displayName", "description", "contacts", "userId") SELECT "id", "displayName", "description", "contacts", "userId" FROM "organizer"`);
        await queryRunner.query(`DROP TABLE "organizer"`);
        await queryRunner.query(`ALTER TABLE "temporary_organizer" RENAME TO "organizer"`);
        await queryRunner.query(`CREATE TABLE "temporary_cultural_event" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "date" datetime NOT NULL, "organizerId" varchar, CONSTRAINT "FK_170ab98537cdf3e8beda3e39078" FOREIGN KEY ("organizerId") REFERENCES "organizer" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_cultural_event"("id", "title", "description", "date", "organizerId") SELECT "id", "title", "description", "date", "organizerId" FROM "cultural_event"`);
        await queryRunner.query(`DROP TABLE "cultural_event"`);
        await queryRunner.query(`ALTER TABLE "temporary_cultural_event" RENAME TO "cultural_event"`);
        await queryRunner.query(`CREATE TABLE "temporary_role_permission" ("role_name" varchar CHECK( "role_name" IN ('user','organizer','admin') ) NOT NULL, "permission_name" varchar CHECK( "permission_name" IN ('user:list','user:details','user:create','user:update','user:delete','like:details','like:cultural-event','unlike:cultural-event','organizer:list','organizer:details','organizer:create','organizer:update','organizer:delete','cultural-event:list','cultural-event:details','cultural-event:create','cultural-event:update','cultural-event:delete') ) NOT NULL, CONSTRAINT "FK_c4a3a9107330f4b7aced8988c75" FOREIGN KEY ("permission_name") REFERENCES "permission" ("name") ON DELETE CASCADE ON UPDATE NO ACTION, PRIMARY KEY ("role_name", "permission_name"))`);
        await queryRunner.query(`INSERT INTO "temporary_role_permission"("role_name", "permission_name") SELECT "role_name", "permission_name" FROM "role_permission"`);
        await queryRunner.query(`DROP TABLE "role_permission"`);
        await queryRunner.query(`ALTER TABLE "temporary_role_permission" RENAME TO "role_permission"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_permission" RENAME TO "temporary_role_permission"`);
        await queryRunner.query(`CREATE TABLE "role_permission" ("role_name" varchar CHECK( "role_name" IN ('user','organizer','admin') ) NOT NULL, "permission_name" varchar CHECK( "permission_name" IN ('user:list','user:details','user:create','user:update','user:delete','like:details','like:cultural-event','unlike:cultural-event','organizer:list','organizer:details','organizer:create','organizer:update','organizer:delete','cultural-event:list','cultural-event:details','cultural-event:create','cultural-event:update','cultural-event:delete') ) NOT NULL, PRIMARY KEY ("role_name", "permission_name"))`);
        await queryRunner.query(`INSERT INTO "role_permission"("role_name", "permission_name") SELECT "role_name", "permission_name" FROM "temporary_role_permission"`);
        await queryRunner.query(`DROP TABLE "temporary_role_permission"`);
        await queryRunner.query(`ALTER TABLE "cultural_event" RENAME TO "temporary_cultural_event"`);
        await queryRunner.query(`CREATE TABLE "cultural_event" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL, "date" datetime NOT NULL, "organizerId" varchar)`);
        await queryRunner.query(`INSERT INTO "cultural_event"("id", "title", "description", "date", "organizerId") SELECT "id", "title", "description", "date", "organizerId" FROM "temporary_cultural_event"`);
        await queryRunner.query(`DROP TABLE "temporary_cultural_event"`);
        await queryRunner.query(`ALTER TABLE "organizer" RENAME TO "temporary_organizer"`);
        await queryRunner.query(`CREATE TABLE "organizer" ("id" varchar PRIMARY KEY NOT NULL, "displayName" varchar NOT NULL, "description" varchar NOT NULL, "contacts" text, "userId" varchar, CONSTRAINT "REL_c804f867dbd19cc0cccd61a4a4" UNIQUE ("userId"))`);
        await queryRunner.query(`INSERT INTO "organizer"("id", "displayName", "description", "contacts", "userId") SELECT "id", "displayName", "description", "contacts", "userId" FROM "temporary_organizer"`);
        await queryRunner.query(`DROP TABLE "temporary_organizer"`);
        await queryRunner.query(`ALTER TABLE "like_cultural_event" RENAME TO "temporary_like_cultural_event"`);
        await queryRunner.query(`CREATE TABLE "like_cultural_event" ("user_id" varchar NOT NULL, "cultural_event_id" varchar NOT NULL, PRIMARY KEY ("user_id", "cultural_event_id"))`);
        await queryRunner.query(`INSERT INTO "like_cultural_event"("user_id", "cultural_event_id") SELECT "user_id", "cultural_event_id" FROM "temporary_like_cultural_event"`);
        await queryRunner.query(`DROP TABLE "temporary_like_cultural_event"`);
        await queryRunner.query(`DROP TABLE "role_permission"`);
        await queryRunner.query(`DROP TABLE "permission"`);
        await queryRunner.query(`DROP TABLE "cultural_event"`);
        await queryRunner.query(`DROP TABLE "organizer"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "like_cultural_event"`);
        await queryRunner.query(`DROP TABLE "location"`);
    }

}

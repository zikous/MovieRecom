import typeorm from "typeorm";

const { MigrationInterface, QueryRunner } = typeorm;

export default class MonNomDeMigration1717505727518 {
    name = 'MonNomDeMigration1717505727518'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "movie" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "title" varchar NOT NULL,
                "date" datetime NOT NULL
            )
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            DROP TABLE "movie"
        `);
    }
}

import typeorm from "typeorm";

const { MigrationInterface, QueryRunner } = typeorm;

export default class  $npmConfigName1717751083911 {
    name = ' $npmConfigName1717751083911'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "rating" (
                "id_user" integer NOT NULL,
                "id_movie" integer NOT NULL,
                "rating" integer NOT NULL,
                PRIMARY KEY ("id_user", "id_movie")
            )
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            DROP TABLE "rating"
        `);
    }
}

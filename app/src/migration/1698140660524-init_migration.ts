import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1698140660524 implements MigrationInterface {
    name = 'InitMigration1698140660524'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`sensor_node\` (
                \`nodeID\` int NOT NULL AUTO_INCREMENT,
                PRIMARY KEY (\`nodeID\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`rfid_scanner\` (
                \`scannerID\` int NOT NULL AUTO_INCREMENT,
                \`nodeID\` int NULL,
                PRIMARY KEY (\`scannerID\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`user\` (
                \`userID\` int NOT NULL AUTO_INCREMENT,
                \`name\` varchar(255) NOT NULL,
                \`email\` varchar(255) NOT NULL,
                \`password\` varchar(255) NOT NULL,
                \`role\` varchar(255) NOT NULL,
                PRIMARY KEY (\`userID\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`product_category\` (
                \`categoryID\` int NOT NULL AUTO_INCREMENT,
                \`categoryName\` varchar(255) NOT NULL,
                PRIMARY KEY (\`categoryID\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`product\` (
                \`productID\` int NOT NULL AUTO_INCREMENT,
                \`categoryID\` int NOT NULL,
                \`productName\` varchar(255) NOT NULL,
                \`userID\` int NULL,
                PRIMARY KEY (\`productID\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`shipment_order\` (
                \`orderID\` int NOT NULL AUTO_INCREMENT,
                \`productID\` int NULL,
                \`senderUserID\` int NULL,
                \`recipientUserID\` int NULL,
                PRIMARY KEY (\`orderID\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`rfid_tag\` (
                \`tagID\` int NOT NULL AUTO_INCREMENT,
                \`associatedOrderID\` int NULL,
                PRIMARY KEY (\`tagID\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`rfid_scan_record\` (
                \`recordID\` int NOT NULL AUTO_INCREMENT,
                \`scanTimestamp\` datetime NOT NULL,
                \`scannerID\` int NULL,
                \`tagID\` int NULL,
                PRIMARY KEY (\`recordID\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`sensor_data_record\` (
                \`recordID\` int NOT NULL AUTO_INCREMENT,
                \`timestamp\` datetime NOT NULL,
                \`dataType\` varchar(255) NOT NULL,
                \`dataValue\` varchar(255) NOT NULL,
                \`nodeID\` int NULL,
                PRIMARY KEY (\`recordID\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`rfid_scanner\`
            ADD CONSTRAINT \`FK_5420eee00ac2297047457bcbc15\` FOREIGN KEY (\`nodeID\`) REFERENCES \`sensor_node\`(\`nodeID\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`product\`
            ADD CONSTRAINT \`FK_63391f06315841e0ce5416921c8\` FOREIGN KEY (\`userID\`) REFERENCES \`user\`(\`userID\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`product\`
            ADD CONSTRAINT \`FK_0682887721c4045868fb8104e2a\` FOREIGN KEY (\`categoryID\`) REFERENCES \`product_category\`(\`categoryID\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`shipment_order\`
            ADD CONSTRAINT \`FK_e5cf51fd323a4068c58c56de81c\` FOREIGN KEY (\`productID\`) REFERENCES \`product\`(\`productID\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`shipment_order\`
            ADD CONSTRAINT \`FK_002151779a1b89134829fe1b86f\` FOREIGN KEY (\`senderUserID\`) REFERENCES \`user\`(\`userID\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`shipment_order\`
            ADD CONSTRAINT \`FK_8357d22be156e0a3dcd6c1448df\` FOREIGN KEY (\`recipientUserID\`) REFERENCES \`user\`(\`userID\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`rfid_tag\`
            ADD CONSTRAINT \`FK_4cc334c06170afe6bd230ccb904\` FOREIGN KEY (\`associatedOrderID\`) REFERENCES \`shipment_order\`(\`orderID\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`rfid_scan_record\`
            ADD CONSTRAINT \`FK_c28b533a374cd9630cad4537170\` FOREIGN KEY (\`scannerID\`) REFERENCES \`rfid_scanner\`(\`scannerID\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`rfid_scan_record\`
            ADD CONSTRAINT \`FK_08fae8b33f69954c7f5f0d23217\` FOREIGN KEY (\`tagID\`) REFERENCES \`rfid_tag\`(\`tagID\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`sensor_data_record\`
            ADD CONSTRAINT \`FK_3323798627cef59bd2d06057d31\` FOREIGN KEY (\`nodeID\`) REFERENCES \`sensor_node\`(\`nodeID\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`sensor_data_record\` DROP FOREIGN KEY \`FK_3323798627cef59bd2d06057d31\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`rfid_scan_record\` DROP FOREIGN KEY \`FK_08fae8b33f69954c7f5f0d23217\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`rfid_scan_record\` DROP FOREIGN KEY \`FK_c28b533a374cd9630cad4537170\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`rfid_tag\` DROP FOREIGN KEY \`FK_4cc334c06170afe6bd230ccb904\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`shipment_order\` DROP FOREIGN KEY \`FK_8357d22be156e0a3dcd6c1448df\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`shipment_order\` DROP FOREIGN KEY \`FK_002151779a1b89134829fe1b86f\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`shipment_order\` DROP FOREIGN KEY \`FK_e5cf51fd323a4068c58c56de81c\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`product\` DROP FOREIGN KEY \`FK_0682887721c4045868fb8104e2a\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`product\` DROP FOREIGN KEY \`FK_63391f06315841e0ce5416921c8\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`rfid_scanner\` DROP FOREIGN KEY \`FK_5420eee00ac2297047457bcbc15\`
        `);
        await queryRunner.query(`
            DROP TABLE \`sensor_data_record\`
        `);
        await queryRunner.query(`
            DROP TABLE \`rfid_scan_record\`
        `);
        await queryRunner.query(`
            DROP TABLE \`rfid_tag\`
        `);
        await queryRunner.query(`
            DROP TABLE \`shipment_order\`
        `);
        await queryRunner.query(`
            DROP TABLE \`product\`
        `);
        await queryRunner.query(`
            DROP TABLE \`product_category\`
        `);
        await queryRunner.query(`
            DROP TABLE \`user\`
        `);
        await queryRunner.query(`
            DROP TABLE \`rfid_scanner\`
        `);
        await queryRunner.query(`
            DROP TABLE \`sensor_node\`
        `);
    }

}

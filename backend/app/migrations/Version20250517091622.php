<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250517091622 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE expediente ADD descripcion VARCHAR(150) NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE expediente ADD cliente_id INT NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE expediente ADD CONSTRAINT FK_D59CA413DE734E51 FOREIGN KEY (cliente_id) REFERENCES cliente (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_D59CA413DE734E51 ON expediente (cliente_id)
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE expediente DROP CONSTRAINT FK_D59CA413DE734E51
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX IDX_D59CA413DE734E51
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE expediente DROP descripcion
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE expediente DROP cliente_id
        SQL);
    }
}

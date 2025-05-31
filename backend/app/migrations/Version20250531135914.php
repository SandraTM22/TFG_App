<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250531135914 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE cliente ADD direccion_id INT DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE cliente ADD CONSTRAINT FK_F41C9B25D0A7BD7 FOREIGN KEY (direccion_id) REFERENCES direccion (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            CREATE UNIQUE INDEX UNIQ_F41C9B25D0A7BD7 ON cliente (direccion_id)
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE cliente DROP CONSTRAINT FK_F41C9B25D0A7BD7
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX UNIQ_F41C9B25D0A7BD7
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE cliente DROP direccion_id
        SQL);
    }
}

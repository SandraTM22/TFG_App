<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250510092825 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE direccion DROP CONSTRAINT fk_f384be952dbc7623
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX idx_f384be952dbc7623
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE direccion DROP procurador_id
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE procurador ADD CONSTRAINT FK_30D459EDD0A7BD7 FOREIGN KEY (direccion_id) REFERENCES direccion (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_30D459EDD0A7BD7 ON procurador (direccion_id)
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE procurador DROP CONSTRAINT FK_30D459EDD0A7BD7
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX IDX_30D459EDD0A7BD7
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE direccion ADD procurador_id INT NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE direccion ADD CONSTRAINT fk_f384be952dbc7623 FOREIGN KEY (procurador_id) REFERENCES procurador (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX idx_f384be952dbc7623 ON direccion (procurador_id)
        SQL);
    }
}

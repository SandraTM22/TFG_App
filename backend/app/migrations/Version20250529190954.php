<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250529190954 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE nota ADD costa_id DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE nota ADD CONSTRAINT FK_C8D03E0DDDC6F119 FOREIGN KEY (costa_id) REFERENCES costas (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_C8D03E0DDDC6F119 ON nota (costa_id)
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE nota DROP CONSTRAINT FK_C8D03E0DDDC6F119
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX IDX_C8D03E0DDDC6F119
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE nota DROP costa_id
        SQL);
    }
}

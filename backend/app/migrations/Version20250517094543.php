<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250517094543 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE documento ADD expediente_id INT DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE documento ADD CONSTRAINT FK_B6B12EC74BF37E4E FOREIGN KEY (expediente_id) REFERENCES expediente (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_B6B12EC74BF37E4E ON documento (expediente_id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE juzgado DROP notas
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE nota ADD juzgado_id INT DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE nota ADD expediente_id INT DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE nota ADD CONSTRAINT FK_C8D03E0DB9A57363 FOREIGN KEY (juzgado_id) REFERENCES juzgado (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE nota ADD CONSTRAINT FK_C8D03E0D4BF37E4E FOREIGN KEY (expediente_id) REFERENCES expediente (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_C8D03E0DB9A57363 ON nota (juzgado_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_C8D03E0D4BF37E4E ON nota (expediente_id)
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE nota DROP CONSTRAINT FK_C8D03E0DB9A57363
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE nota DROP CONSTRAINT FK_C8D03E0D4BF37E4E
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX IDX_C8D03E0DB9A57363
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX IDX_C8D03E0D4BF37E4E
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE nota DROP juzgado_id
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE nota DROP expediente_id
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE documento DROP CONSTRAINT FK_B6B12EC74BF37E4E
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX IDX_B6B12EC74BF37E4E
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE documento DROP expediente_id
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE juzgado ADD notas TEXT DEFAULT NULL
        SQL);
    }
}

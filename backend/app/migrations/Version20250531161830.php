<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250531161830 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            DROP INDEX idx_ffd95067d0a7bd7
        SQL);
        $this->addSql(<<<'SQL'
            CREATE UNIQUE INDEX UNIQ_FFD95067D0A7BD7 ON contrario (direccion_id)
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX idx_30d459edd0a7bd7
        SQL);
        $this->addSql(<<<'SQL'
            CREATE UNIQUE INDEX UNIQ_30D459EDD0A7BD7 ON procurador (direccion_id)
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            DROP INDEX UNIQ_FFD95067D0A7BD7
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX idx_ffd95067d0a7bd7 ON contrario (direccion_id)
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX UNIQ_30D459EDD0A7BD7
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX idx_30d459edd0a7bd7 ON procurador (direccion_id)
        SQL);
    }
}

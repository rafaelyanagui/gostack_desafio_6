import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export default class CreateTransactions1588911471074
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'transactions',
      new TableForeignKey({
        name: 'TransactionCategoryFK',
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'transaction_categories',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropForeignKey('transactions', 'TransactionCategoryFK');
  }
}

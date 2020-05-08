import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class CreateTransactions1588911303771
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.changeColumn(
      'transactions',
      'value',
      new TableColumn({
        name: 'value',
        type: 'integer',
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.changeColumn(
      'transactions',
      'value',
      new TableColumn({
        name: 'value',
        type: 'decimal',
        isNullable: false,
        default: 0,
      }),
    );
  }
}

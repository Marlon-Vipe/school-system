import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../auth/user.entity';

export enum CashEntryType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export enum CashEntryCategory {
  // Ingresos
  TUITION_PAYMENT = 'tuition_payment',
  ENROLLMENT_FEE = 'enrollment_fee',
  MATERIAL_FEE = 'material_fee',
  OTHER_INCOME = 'other_income',
  
  // Egresos
  SALARIES = 'salaries',
  UTILITIES = 'utilities',
  MAINTENANCE = 'maintenance',
  SUPPLIES = 'supplies',
  MARKETING = 'marketing',
  OTHER_EXPENSE = 'other_expense',
}

export enum CashEntryStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

@Entity('cash_entries')
export class CashEntry {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'enum',
    enum: CashEntryType,
  })
  type!: CashEntryType;

  @Column({
    type: 'enum',
    enum: CashEntryCategory,
  })
  category!: CashEntryCategory;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount!: number;

  @Column({ type: 'varchar', length: 255 })
  description!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  reference?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({
    type: 'enum',
    enum: CashEntryStatus,
    default: CashEntryStatus.PENDING,
  })
  status!: CashEntryStatus;

  @Column({ type: 'date' })
  transactionDate!: Date;

  @Column({ type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'uuid', nullable: true })
  paymentId?: string; // Referencia a un pago relacionado (para ingresos)

  @Column({ type: 'varchar', length: 255, nullable: true })
  receiptNumber?: string;

  @Column({ type: 'text', nullable: true })
  attachments?: string; // URLs de archivos adjuntos

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Virtual properties
  get isIncome(): boolean {
    return this.type === CashEntryType.INCOME;
  }

  get isExpense(): boolean {
    return this.type === CashEntryType.EXPENSE;
  }

  get formattedAmount(): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(Number(this.amount));
  }

  get categoryLabel(): string {
    const labels: Record<CashEntryCategory, string> = {
      [CashEntryCategory.TUITION_PAYMENT]: 'Pago de Matrícula',
      [CashEntryCategory.ENROLLMENT_FEE]: 'Cuota de Inscripción',
      [CashEntryCategory.MATERIAL_FEE]: 'Cuota de Materiales',
      [CashEntryCategory.OTHER_INCOME]: 'Otros Ingresos',
      [CashEntryCategory.SALARIES]: 'Salarios',
      [CashEntryCategory.UTILITIES]: 'Servicios Públicos',
      [CashEntryCategory.MAINTENANCE]: 'Mantenimiento',
      [CashEntryCategory.SUPPLIES]: 'Suministros',
      [CashEntryCategory.MARKETING]: 'Marketing',
      [CashEntryCategory.OTHER_EXPENSE]: 'Otros Gastos',
    };
    return labels[this.category];
  }
}

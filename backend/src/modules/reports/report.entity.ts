import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../auth/user.entity';

export enum ReportType {
  FINANCIAL = 'financial',
  STUDENT_ANALYSIS = 'student_analysis',
  PAYMENT_SUMMARY = 'payment_summary',
  ENROLLMENT_REPORT = 'enrollment_report',
  COURSE_PERFORMANCE = 'course_performance',
  CASH_FLOW = 'cash_flow',
  PURCHASE_ANALYSIS = 'purchase_analysis',
  CUSTOM = 'custom'
}

export enum ReportStatus {
  PENDING = 'pending',
  GENERATING = 'generating',
  COMPLETED = 'completed',
  FAILED = 'failed',
  EXPIRED = 'expired'
}

export enum ReportFormat {
  PDF = 'pdf',
  EXCEL = 'excel',
  CSV = 'csv',
  JSON = 'json'
}

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'enum', enum: ReportType })
  type!: ReportType;

  @Column({ type: 'enum', enum: ReportFormat, default: ReportFormat.PDF })
  format!: ReportFormat;

  @Column({ type: 'enum', enum: ReportStatus, default: ReportStatus.PENDING })
  status!: ReportStatus;

  @Column({ type: 'jsonb', nullable: true })
  parameters?: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  filters?: Record<string, any>;

  @Column({ type: 'date', nullable: true })
  startDate?: Date;

  @Column({ type: 'date', nullable: true })
  endDate?: Date;

  @Column({ type: 'varchar', length: 500, nullable: true })
  filePath?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  downloadUrl?: string;

  @Column({ type: 'integer', default: 0 })
  downloadCount!: number;

  @Column({ type: 'timestamp', nullable: true })
  generatedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date;

  @Column({ type: 'text', nullable: true })
  errorMessage?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'uuid' })
  requestedBy!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'requestedBy' })
  requester?: User;
}

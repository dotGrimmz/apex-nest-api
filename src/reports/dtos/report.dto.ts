import { Expose, Transform } from 'class-transformer';
import { User } from '../../users/user.entity';
export class ReportDto {
  constructor() {}
  @Expose()
  id: number;
  @Expose()
  price: number;
  @Expose()
  year: number;
  @Expose()
  lat: number;
  @Expose()
  lng: number;
  @Expose()
  mileage: number;
  @Expose()
  model: string;
  @Expose()
  make: string;

  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: string;
}

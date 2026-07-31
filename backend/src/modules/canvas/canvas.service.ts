import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class CanvasService {
  connect(_input: { token: string }) {
    throw new NotImplementedException('Canvas integration is not implemented yet.');
  }

  courses() {
    return [];
  }

  sync(_input: { courseIds: string[] }) {
    throw new NotImplementedException('Canvas sync is not implemented yet.');
  }
}

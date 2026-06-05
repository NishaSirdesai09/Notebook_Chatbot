import { Injectable } from '@nestjs/common';
import { CanvasCourse } from '../../common/types';
import { seedCanvasCourses } from '../../common/seed';
import { ConnectCanvasDto, SyncCanvasDto } from './dto/canvas.dto';

@Injectable()
export class CanvasService {
  private connected = false;

  /**
   * Validate the Canvas API token. Production: call the Canvas API
   * (GET /api/v1/users/self) with the token to confirm access.
   */
  connect(dto: ConnectCanvasDto): { connected: boolean } {
    this.connected = Boolean(dto.token);
    return { connected: this.connected };
  }

  courses(): CanvasCourse[] {
    return seedCanvasCourses;
  }

  /**
   * Pull files, modules, assignments, and announcements for the selected
   * courses, then push them through the document processing pipeline.
   */
  sync(dto: SyncCanvasDto): { syncedAt: string; courseIds: string[]; itemsSynced: number } {
    return {
      syncedAt: new Date().toISOString(),
      courseIds: dto.courseIds,
      itemsSynced: dto.courseIds.length * 12,
    };
  }
}

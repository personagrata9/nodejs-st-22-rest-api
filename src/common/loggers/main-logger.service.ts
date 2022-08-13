import 'dotenv/config';
import { Injectable, Scope, ConsoleLogger } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class MainLogger extends ConsoleLogger {
  constructor() {
    super();
    this.setLogLevels(
      process.env.DEBUG === 'true'
        ? ['log', 'error', 'debug']
        : ['log', 'error'],
    );
  }
}

import {EventEmitter} from '@angular/core';

import PNotifyButtons from 'pnotify/dist/es/PNotifyButtons';
import PNotify from 'pnotify/dist/es/PNotify';

export class NotificationService {
  notifier = new EventEmitter<string>();

  constructor() {
    PNotifyButtons; // Initiate the module. Important
  }

  notify(message: string, type = 'notice') {
    return PNotify.alert({
      text: message,
      type,
      delay: 3000
    });
  }

  success(message: string) {
    return this.notify(message, 'success');
  }

  error(message: string) {
    return this.notify(message, 'error');
  }
}

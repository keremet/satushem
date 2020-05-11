import {Injectable} from '@angular/core';
import {RestApiService} from './rest-api.service';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {
  constructor(
    private rest: RestApiService
  ) { }

  /**
   * Upload image to server
   * @param {File} file Image file to upload
   * @returns {string} Url to uploaded file
   */
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file, file.name);

    const resp = await this.rest.uploadImage(formData);
    return resp['file'];
  }

}

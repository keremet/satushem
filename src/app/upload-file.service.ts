import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';
import {RestApiService} from './rest-api.service';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  private uploadUrl = environment.uploadUrl;

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

    const resp = await this.rest.uploadImage(this.uploadUrl, formData);
    return resp['file'];
  }

}

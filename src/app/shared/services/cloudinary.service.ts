import { inject, Injectable } from '@angular/core';
import { LoggerService } from '../services/logger/logger.service';
import { ApiResponse } from '../interfaces/api-response.interface';
import { CloudinarySignatureResponse } from '../interfaces/cloudinary-signature.response.interface';
import { Observable, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../env/environment';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {

  constructor(
    private readonly _http:HttpClient
  ){}
  private readonly _logger = inject(LoggerService);

    getCloudinarySignature(params: { folder: string; publicIdPrefix?: string; tags?: string[] }): Observable<ApiResponse<CloudinarySignatureResponse>> {
      return this._http.post<ApiResponse<CloudinarySignatureResponse>>(`${environment.apiUrl}/cloudinary/sign-upload`, params)
      .pipe(
        tap(res=>[
          this._logger.log("Cloudinary signature fetched",res)
        ])
      )
    }


    uploadFileToCloudinary(
      file: File,
      signatureData: CloudinarySignatureResponse,
      folder: string,
      publicIdBase: string
    ): Observable<Record<string, unknown>> {
      this._logger.log("Cloudinary upload data", { folder, publicIdBase });
        const formData = new FormData()
        formData.append('file', file);
        formData.append('api_key', signatureData.apiKey);
        formData.append('timestamp', signatureData.timestamp.toString());
        formData.append('signature', signatureData.signature);
        formData.append('folder', folder);
        formData.append('public_id', signatureData.publicId || `${publicIdBase}_${Date.now()}`);
        const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`
        return this._http.post<Record<string, unknown>>(cloudinaryUploadUrl, formData).pipe(
        tap(res => {
          this._logger.log("Cloudinary upload response", res)
        })
        )
    }

    uploadImage(file: File): Observable<Record<string, unknown>> {
      return this.getCloudinarySignature({ folder: 'admin_profile' }).pipe(
        switchMap(signatureRes => {
          if (!signatureRes.success || !signatureRes.data) {
            throw new Error('Failed to get Cloudinary signature');
          }
          return this.uploadFileToCloudinary(file, signatureRes.data, 'admin_profile', 'admin');
        })
      );
    }

}

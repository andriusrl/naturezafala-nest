import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import * as path from 'path';
import * as crypto from 'crypto';
import * as sharp from 'sharp';

@Injectable()
export class UploadService {

    async execute(fileObject: Express.Multer.File, pathDestination): Promise<any> {
        const s3 = new S3();

        const fileHash = crypto.randomBytes(10).toString('hex');
        if (fileObject.buffer) {
            const extension: string =
                path.parse(fileObject.originalname).ext ||
                fileObject.mimetype.replace(`image/`, '.');

            const fileBuffer = await sharp(fileObject.buffer)
                .jpeg({ mozjpeg: true })
                .toBuffer();

            const uploadResponse = await s3
                .upload({
                    Bucket: process.env.BUCKET_NAME!,
                    Body: fileBuffer,
                    Key: `${pathDestination}${fileHash}${fileObject.fieldname || fileObject.originalname
                        }${extension}`,
                })
                .promise();
            return uploadResponse;
        }
    }

    async delete(url): Promise<any> {
        const s3 = new S3();
        const deletePromise = await s3
            .deleteObject({
                Bucket: process.env.BUCKET_NAME!,
                Key: await this.convertUrlToKey(url),
            })
            .promise();
        return deletePromise;
    }

    async deleteFolder(path): Promise<any> {
        const pathConverted = await this.convertUrlToKey(path);

        const listParams = {
            Bucket: process.env.BUCKET_NAME!,
            Prefix: pathConverted,
        };
        const s3 = new S3();

        const listedObjects = await s3.listObjectsV2(listParams).promise();

        if (listedObjects.Contents.length === 0)
            return 'Não existe pasta a ser deletada';

        const deleteParams = {
            Bucket: process.env.BUCKET_NAME!,
            Delete: { Objects: [] },
        };

        listedObjects.Contents.forEach(({ Key }) => {
            deleteParams.Delete.Objects.push({ Key });
        });

        await s3.deleteObjects(deleteParams).promise();

        if (listedObjects.IsTruncated) await this.deleteFolder(pathConverted);
    }

    async convertUrlToKey(url) {
        const response =
            url &&
            decodeURIComponent(
                url.replace(
                    `https://s3.${process.env.AWS_REGION!}.amazonaws.com/${process.env
                        .BUCKET_NAME!}/`,
                    '',
                ),
            );

        return response;
    }

    async getBucketKey(url): Promise<string> {
        return url.img_polo.replace(
            `https://s3.${process.env.AWS_REGION!}.amazonaws.com/`,
            '',
        );
    }
}
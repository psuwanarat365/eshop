import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'ui-gallery',
    templateUrl: './gallery.component.html',
    styles: []
})
export class GalleryComponent implements OnInit {
    selectedImageURL: string;

    @Input() images: string[];

    // constructor() {}

    ngOnInit(): void {
        if (this.hasImages) {
            this.selectedImageURL = this.images[0];
        }
    }

    changeSelectedImage(imageUrl: string) {
        this.selectedImageURL = imageUrl;
    }
    // images? สำหรับ ? เป็นตรวจสอบว่ามี images หรือไม่
    // ถ้ามี images ให้ทำ length > 0 แล้ว return true
    // ถ้าไม่มี image ให้หยุดทำ length > 0 แล้ว return false
    get hasImages() {
        return this.images?.length > 0;
    }
}

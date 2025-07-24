import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { GoogleMapsModule } from '@angular/google-maps';

interface Coordinate {
    lat: number;
    lng: number;
}

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    imports: [GoogleMapsModule],
    standalone: true
})
export class MapComponent implements OnChanges {
    @Input({ required: true }) latitude: number = -0.22985;
    @Input({ required: true }) longitude: number = -78.52495;
    @Output() dataOut: EventEmitter<Coordinate> = new EventEmitter<Coordinate>(false);

    protected readonly PrimeIcons = PrimeIcons;

    protected zoom = 15;
    protected center: google.maps.LatLngLiteral = { lat: -0.22985, lng: -78.52495 };
    protected markerPosition: google.maps.LatLngLiteral = { lat: -0.22985, lng: -78.52495 };

    constructor() {}

    ngOnChanges(changes: SimpleChanges): void {
        if ((changes['latitude'] || changes['longitude']) && this.latitude && this.longitude) {
            this.center = { lat: this.latitude, lng: this.longitude };
            this.markerPosition = { lat: this.latitude, lng: this.longitude };
        }
    }

    onMapClick(event: google.maps.MapMouseEvent) {
        if (event.latLng) {
            this.markerPosition = {
                lat: event.latLng.lat(),
                lng: event.latLng.lng()
            };

            this.dataOut.emit(this.markerPosition);
        }
    }
}

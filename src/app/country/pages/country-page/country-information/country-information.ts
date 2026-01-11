import { Component, computed, input, ViewChild, ElementRef, AfterViewInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Country } from '../../../interfaces/country.inteface';
import { DecimalPipe } from '@angular/common';
import * as L from 'leaflet';

@Component({
  selector: 'country-information-page',
  imports: [DecimalPipe],
  templateUrl: './country-information.html',
})
export class CountryInformation implements AfterViewInit {

  country = input.required<Country>();
  currentYear = computed(()=>{
    return new Date().getFullYear();
  });

  @ViewChild('mapContainer') mapContainer?: ElementRef<HTMLDivElement>;
  private map!: L.Map;
  private http = inject(HttpClient);

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  private initializeMap(): void {
    if (!this.mapContainer) return;

    // Crear mapa centrado en las coordenadas del país
    this.map = L.map(this.mapContainer.nativeElement).setView(
      [this.country().latlng[0], this.country().latlng[1]],
      5
    );

    // Agregar capa de tiles de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 10,
    }).addTo(this.map);

    // Cargar GeoJSON del país desde restcountries
    const geoJsonUrl = `https://restcountries.com/v3.1/alpha/${this.country().cca2}`;

    this.http.get<any[]>(geoJsonUrl).subscribe((data) => {
      if (data && data[0]?.geoJsonFeature) {
        const geoJson = data[0].geoJsonFeature;

        // Agregar GeoJSON al mapa
        const geoJsonLayer = L.geoJSON(geoJson, {
          style: {
            color: '#000000',
            weight: 10,
            opacity: 1,
            fillColor: '#000000',
            fillOpacity: 1,
          },
          onEachFeature: (feature, layer) => {
            const popupContent = `
              <div class="popup-content" style="text-align: center; font-family: Arial, sans-serif;">
                <h3 style="margin: 0 0 8px 0; color: #000000;">${this.country().name}</h3>
                <p style="margin: 0; font-size: 12px; color: #666;">
                  <strong>Código:</strong> ${this.country().cca2}
                </p>
              </div>
            `;
            layer.bindPopup(popupContent);

            // Mostrar popup al pasar el ratón
            layer.on('mouseover', () => {
              layer.openPopup();
            });
            layer.on('mouseout', () => {
              layer.closePopup();
            });
          }
        }).addTo(this.map);

        // Ajustar el zoom a los límites del país
        this.map.fitBounds(geoJsonLayer.getBounds());

        // Abrir popup al cargar
        geoJsonLayer.eachLayer((layer: any) => {
          if (layer.openPopup) {
            setTimeout(() => {
              layer.openPopup();
            }, 500);
          }
        });
      }
    }, (error) => {
      console.error('Error loading GeoJSON:', error);
      // Si no se carga el GeoJSON, dibujar un marcador simple
      this.drawFallbackMarker();
    });
  }

  private drawFallbackMarker(): void {
    // Marcador de fallback si no se carga el GeoJSON
    L.marker([this.country().latlng[0], this.country().latlng[1]], {
      title: this.country().name,
    }).addTo(this.map).bindPopup(`<strong>${this.country().name}</strong>`);
  }
}

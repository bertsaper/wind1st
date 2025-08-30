import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Router } from '@angular/router';

interface WeatherData {
  wind: { deg: number; speed: number };
  main: { humidity: number; temp: number };
  weather: [{ description: string }];
  name: string;
}

enum UnitSystem {
  Imperial = 'imperial',
  Metric = 'metric',
}

enum WindDirection {
  North = 'North',
  Northeast = 'Northeast',
  East = 'East',
  Southeast = 'Southeast',
  South = 'South',
  Southwest = 'Southwest',
  West = 'West',
  Northwest = 'Northwest',
}

@Injectable({
  providedIn: 'root',
})
export class WeatherSvgService {
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2, private router: Router) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  getWindDirection(deg: number): string {
    if (deg == null || isNaN(deg)) return WindDirection.North;
    deg = deg % 360; // Normalize degree to 0-360
    if (deg >= 337.5 || deg < 22.5) return WindDirection.North;
    if (deg < 67.5) return WindDirection.Northeast;
    if (deg < 112.5) return WindDirection.East;
    if (deg < 157.5) return WindDirection.Southeast;
    if (deg < 202.5) return WindDirection.South;
    if (deg < 247.5) return WindDirection.Southwest;
    if (deg < 292.5) return WindDirection.West;
    return WindDirection.Northwest;
  }

  buildWeatherSvg(
    container: HTMLElement,
    weatherData: WeatherData,
    unitSystem: UnitSystem,
    selectedWindSpeed: string,
    selectedTemperature: string,
    downloadDate: string,
    downloadTime: string,
    downloadDateTime: string,
    screenWidth: number,
    weatherDisplayId: string,
    altDisplayId: string,
    ariaDisplayId: string,
    locationSettings: string
  ): void {
    try {
      if (!container || !weatherData) {
        throw new Error('Invalid container or weather data');
      }

      const windSpeed = this.calculateWindSpeed(weatherData.wind?.speed ?? 0, unitSystem);
      const windDeg = weatherData.wind?.deg ?? 0;

      const temp = Math.round(weatherData.main?.temp ?? 0);
      const humidity = weatherData.main?.humidity ? `${weatherData.main.humidity}% humidity` : 'N/A';
      const description = weatherData.weather?.[0]?.description ?? 'No description';
      const place = weatherData.name ?? 'Unknown';

      const compass = this.createCompassSvg(weatherDisplayId);
      const infoGroup = this.createSvgGroup('infoGroup', '360', '360');
      const bandGroup = this.createSvgGroup('bandGroup', '360', '360');

      const circle = this.createBoundingCircle();
      const bands = this.createSpeedBands(unitSystem);
      const directionElements = this.createDirectionLabels();
      console.log('Wind data:', { windDeg, windSpeed, direction: this.getWindDirection(windDeg), directionElements: Object.keys(directionElements) });
      this.highlightDirection(windDeg, directionElements);
      const weatherTexts = this.createWeatherInfoTexts(temp, selectedTemperature, humidity, description, place, downloadTime, downloadDate);
      const windVelocityText = this.createWindVelocityText(windSpeed, selectedWindSpeed, windDeg);
      const windVectorArrow = this.createWindVectorArrow(windSpeed, windDeg, unitSystem);
      const displayAlt = this.createAltDisplay(altDisplayId, place, description, humidity, temp, selectedTemperature, windSpeed, selectedWindSpeed, this.getWindDirection(windDeg), downloadDateTime);
      const displayAria = this.createAriaDisplay(ariaDisplayId, place, description, humidity, temp, selectedTemperature, windSpeed, selectedWindSpeed, this.getWindDirection(windDeg), downloadDateTime);

      this.assembleSvg(compass, bandGroup, infoGroup, bands, Object.values(directionElements), weatherTexts, windVelocityText, circle, windVectorArrow, displayAlt, displayAria, container, screenWidth, locationSettings);
    } catch (error) {
      console.error('Error building weather SVG:', error);
      this.router.navigate([locationSettings]);
    }
  }

  private calculateWindSpeed(speed: number, unit: UnitSystem): number {
    return unit === UnitSystem.Imperial ? Math.round(speed) : Math.round(speed * 3.6);
  }

  private createCompassSvg(id: string): SVGSVGElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.renderer.setAttribute(svg, 'height', '440');
    this.renderer.setAttribute(svg, 'width', '400');
    this.renderer.setAttribute(svg, 'id', id);
    this.renderer.setAttribute(svg, 'aria-hidden', 'true');
    return svg;
  }

  private createSvgGroup(id: string, height: string, width: string): SVGGElement {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.renderer.setAttribute(g, 'height', height);
    this.renderer.setAttribute(g, 'width', width);
    this.renderer.setAttribute(g, 'id', id);
    return g;
  }

  private createBoundingCircle(): SVGCircleElement {
    const fill = 'rgba(255, 255, 255, 0.125)';
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    this.renderer.setAttribute(circle, 'cx', '200');
    this.renderer.setAttribute(circle, 'cy', '220');
    this.renderer.setAttribute(circle, 'r', '150');
    this.renderer.setAttribute(circle, 'id', 'windDirectionHolder');
    this.renderer.setAttribute(circle, 'fill', fill);
    this.renderer.setAttribute(circle, 'stroke-width', '0');
    return circle;
  }

  private createSpeedBands(unit: UnitSystem): SVGCircleElement[] {
    const fill = 'rgba(255, 255, 255, 0)';
    const stroke = 'rgba(255, 255, 255, 0.125)';
    const bands: SVGCircleElement[] = [];
    const createBand = (id: string, r: string) => {
      const band = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      this.renderer.setAttribute(band, 'cx', '200');
      this.renderer.setAttribute(band, 'cy', '220');
      this.renderer.setAttribute(band, 'r', r);
      this.renderer.setAttribute(band, 'id', id);
      this.renderer.setAttribute(band, 'fill', fill);
      this.renderer.setAttribute(band, 'stroke', stroke);
      bands.push(band);
    };

    if (unit === UnitSystem.Imperial) {
      createBand('band25mph', '130');
      createBand('band20mph', '110');
      createBand('band15mph', '90');
      createBand('band10mph', '70');
      createBand('band5mph', '50');
    } else {
      createBand('band40kph', '125');
      createBand('band30kph', '95');
      createBand('band20kph', '65');
      createBand('band10kph', '35');
    }
    return bands;
  }

  private createDirectionLabels(): { [key: string]: SVGTextElement } {
    const createText = (id: string, baseline: string, x: string, y: string, text: string) => {
      const elem = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      this.renderer.setAttribute(elem, 'id', id);
      this.renderer.setAttribute(elem, 'dominant-baseline', baseline);
      this.renderer.setAttribute(elem, 'x', x);
      this.renderer.setAttribute(elem, 'y', y);
      elem.textContent = text;
      return elem;
    };

    return {
      N: createText('cardinalN', 'auto', '195', '60', 'N'),
      S: createText('cardinalS', 'hanging', '195', '380', 'S'),
      E: createText('cardinalE', 'middle', '360', '220', 'E'),
      W: createText('cardinalW', 'middle', '26', '220', 'W'),
      NW: createText('ordinalNW', 'baseline', '65', '105', 'NW'),
      SW: createText('ordinalSW', 'hanging', '65', '335', 'SW'),
      NE: createText('ordinalNE', 'baseline', '310', '105', 'NE'),
      SE: createText('ordinalSE', 'hanging', '310', '335', 'SE'),
    };
  }

  private highlightDirection(deg: number, elements: { [key: string]: SVGTextElement }): void {
    const direction = this.getWindDirection(deg);
    let elemKey: string;
    switch (direction) {
      case WindDirection.North:
        elemKey = 'N';
        break;
      case WindDirection.South:
        elemKey = 'S';
        break;
      case WindDirection.East:
        elemKey = 'E';
        break;
      case WindDirection.West:
        elemKey = 'W';
        break;
      case WindDirection.Northeast:
        elemKey = 'NE';
        break;
      case WindDirection.Southeast:
        elemKey = 'SE';
        break;
      case WindDirection.Southwest:
        elemKey = 'SW';
        break;
      case WindDirection.Northwest:
        elemKey = 'NW';
        break;
      default:
        elemKey = 'N'; // Fallback
    }
    if (elements[elemKey]) {
      this.renderer.setAttribute(elements[elemKey], 'font-weight', 'bold');
    } else {
      console.warn(`Direction element for key "${elemKey}" not found`);
    }
  }

  private createWeatherInfoTexts(temp: number, selectedTemp: string, humidity: string, description: string, place: string, downloadTime: string, downloadDate: string): SVGTextElement[] {
    const createText = (id: string, x: string, y: string, text: string) => {
      const elem = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      this.renderer.setAttribute(elem, 'id', id);
      this.renderer.setAttribute(elem, 'dominant-baseline', 'baseline');
      this.renderer.setAttribute(elem, 'x', x);
      this.renderer.setAttribute(elem, 'y', y);
      elem.textContent = text || 'N/A';
      return elem;
    };

    return [
      createText('textTemp', '20', '15', `${temp}${selectedTemp}`),
      createText('textHumidity', '70', '15', humidity),
      createText('textDescription', '230', '15', description),
      createText('textLocale', '20', '410', place),
      createText('textDownloadTime', '315', '410', downloadTime),
      createText('textDownloadDate', '325', '430', downloadDate),
    ];
  }

  private createWindVelocityText(windSpeed: number, selectedWindSpeed: string, windDeg: number): SVGTextElement {
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    this.renderer.setAttribute(text, 'id', 'textWindVelocity');
    this.renderer.setAttribute(text, 'dominant-baseline', 'baseline');
    this.renderer.setAttribute(text, 'y', '230');

    let x = '215';
    if (windDeg <= 171) {
      x = windSpeed <= 10 ? '135' : '132';
    }
    this.renderer.setAttribute(text, 'x', x);

    text.textContent = windSpeed > 0 ? `${windSpeed}${selectedWindSpeed}` : 'No Wind';
    return text;
  }

  private createWindVectorArrow(windSpeed: number, windDeg: number, unitSystem: UnitSystem): SVGPathElement {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.renderer.setAttribute(path, 'id', 'windVectorArrow');
    this.renderer.setAttribute(path, 'fill', 'none');
    this.renderer.setAttribute(path, 'stroke', '#ffffff');
    this.renderer.setAttribute(path, 'stroke-width', '3');

    // Calculate arrow length based on wind speed (scale to max 110px for visibility)
    const maxSpeed = unitSystem === UnitSystem.Imperial ? 25 : 40; // Max speed for scaling (mph or kph)
    const arrowLength = Math.min(windSpeed / maxSpeed * 110, 110); // Scalable length up to 110px
    const arrowHeadSize = 12;

    // Define initial and final path data for animation
    const initialPath = `
      M 200 220
      L 200 220
      M ${200 - arrowHeadSize / 2} 220
      L 200 220
      L ${200 + arrowHeadSize / 2} 220
    `;
    const finalPath = `
      M 200 220
      L 200 ${220 - arrowLength}
      M ${200 - arrowHeadSize / 2} ${220 - arrowLength + arrowHeadSize}
      L 200 ${220 - arrowLength}
      L ${200 + arrowHeadSize / 2} ${220 - arrowLength + arrowHeadSize}
    `;

    // Set initial path
    this.renderer.setAttribute(path, 'd', initialPath.trim());

    // Rotate arrow based on wind direction
    this.renderer.setAttribute(path, 'transform', `rotate(${windDeg}, 200, 220)`);

    // Create animation element
    const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
    this.renderer.setAttribute(animate, 'attributeName', 'd');
    this.renderer.setAttribute(animate, 'from', initialPath.trim());
    this.renderer.setAttribute(animate, 'to', finalPath.trim());
    this.renderer.setAttribute(animate, 'repeatCount', '4'); // 'indefinite repeats
    // this.renderer.setAttribute(animate, 'begin', '0s');
    this.renderer.setAttribute(animate, 'fill', 'freeze');
    this.renderer.setAttribute(animate, 'dur', '1s');

    this.renderer.appendChild(path, animate);

    return path;
  }

  private createAltDisplay(id: string, place: string, description: string, humidity: string, temp: number, selectedTemp: string, windSpeed: number, selectedWindSpeed: string, windDirection: string, downloadDateTime: string): SVGSVGElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.renderer.setAttribute(svg, 'height', '150');
    this.renderer.setAttribute(svg, 'width', '150');
    this.renderer.setAttribute(svg, 'id', id);
    this.renderer.setAttribute(svg, 'aria-label', `Current Weather for ${place || 'Unknown'}`);

    const positions = [
      { id: 'textwindDirectionOutputAlt', y: '20', text: windDirection || 'N/A' },
      { id: 'textWindVelocityAlt', y: '40', text: windSpeed > 0 ? `${windSpeed}${selectedWindSpeed}` : 'No Wind' },
      { id: 'textTempAlt', y: '60', text: `${temp}${selectedTemp}` },
      { id: 'textHumidityAlt', y: '80', text: humidity || 'N/A' },
      { id: 'textDescriptionAlt', y: '100', text: description || 'N/A' },
      { id: 'textLocaleAlt', y: '120', text: place || 'Unknown' },
      { id: 'textDownloadTimeAlt', y: '140', text: downloadDateTime || 'N/A' },
    ];

    positions.forEach(pos => {
      const textElem = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      this.renderer.setAttribute(textElem, 'id', pos.id);
      this.renderer.setAttribute(textElem, 'dominant-baseline', 'baseline');
      this.renderer.setAttribute(textElem, 'x', '20');
      this.renderer.setAttribute(textElem, 'y', pos.y);
      textElem.textContent = pos.text;
      this.renderer.appendChild(svg, textElem);
    });

    return svg;
  }

  private createAriaDisplay(id: string, place: string, description: string, humidity: string, temp: number, selectedTemp: string, windSpeed: number, selectedWindSpeed: string, windDirection: string, downloadDateTime: string): SVGSVGElement {
    const svg = this.createAltDisplay(id, place, description, humidity, temp, selectedTemp, windSpeed, selectedWindSpeed, windDirection, downloadDateTime);
    this.renderer.setAttribute(svg, 'height', '1');
    this.renderer.setAttribute(svg, 'width', '1');
    return svg;
  }

  private assembleSvg(
    compass: SVGSVGElement,
    bandGroup: SVGGElement,
    infoGroup: SVGGElement,
    bands: SVGCircleElement[],
    directionElements: SVGTextElement[],
    weatherTexts: SVGTextElement[],
    windVelocityText: SVGTextElement,
    circle: SVGCircleElement,
    windVectorArrow: SVGPathElement,
    displayAlt: SVGSVGElement,
    displayAria: SVGSVGElement,
    container: HTMLElement,
    screenWidth: number,
    locationSettings: string
  ): void {
    try {
      bands.forEach(band => this.renderer.appendChild(bandGroup, band));
      directionElements.forEach(elem => this.renderer.appendChild(infoGroup, elem));
      weatherTexts.forEach(text => this.renderer.appendChild(infoGroup, text));
      this.renderer.appendChild(infoGroup, windVelocityText);
      this.renderer.appendChild(infoGroup, circle);
      this.renderer.appendChild(infoGroup, windVectorArrow);

      this.renderer.appendChild(compass, bandGroup);
      this.renderer.appendChild(compass, infoGroup);

      // Clear container to prevent duplicate SVGs
      while (container.firstChild) {
        this.renderer.removeChild(container, container.firstChild);
      }

      if (screenWidth >= 380) {
        this.renderer.appendChild(container, compass);
        this.renderer.appendChild(container, displayAria);
      } else {
        this.renderer.appendChild(container, displayAlt);
      }
    } catch (error) {
      console.error('SVG assembly error:', error);
      this.router.navigate([locationSettings]);
    }
  }
}
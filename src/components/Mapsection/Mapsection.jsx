import { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import OSM from "ol/source/OSM";
import TileLayer from "ol/layer/Tile";
import View from "ol/View";
import { fromLonLat, transformExtent } from "ol/proj";
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Draw, DragBox } from "ol/interaction";
import { getLength, getArea } from "ol/sphere";
import LineString from "ol/geom/LineString";
import Polygon from "ol/geom/Polygon";
import {
  IoSettingsSharp,
  IoRefresh,
  IoDownload,
  IoResize,
  IoSquareOutline,
} from "react-icons/io5";
import Overlay from "ol/Overlay";
import html2canvas from "html2canvas";

const Mapsection = () => {
  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [measurementToolActive, setMeasurementToolActive] = useState(false);
  const [areaSelectToolActive, setAreaSelectToolActive] = useState(false);
  const [drawLayer, setDrawLayer] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const measureTooltipRef = useRef(null);
  const areaTooltipRef = useRef(null);
  const drawRef = useRef(null);

  useEffect(() => {
    const map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: "map",
      view: new View({
        center: fromLonLat([78.9629, 20.5937]),
        zoom: 5,
      }),
    });

    mapRef.current = map;

    return () => {
      map.setTarget(undefined);
    };
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.updateSize();
    }
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([longitude, latitude]);

          if (mapRef.current) {
            const view = mapRef.current.getView();
            view.setCenter(fromLonLat([longitude, latitude]));
            view.setZoom(12);
          }

          addUserLocationMarker(longitude, latitude);
        },
        (error) => {
          console.error("Error getting geolocation: ", error);
          let errorMessage =
            "An unknown error occurred while retrieving location.";
          switch (error.code) {
            case 1:
              errorMessage =
                "Permission denied. Please allow location access and try again.";
              break;
            case 2:
              errorMessage = "Position unavailable. Please try again later.";
              break;
            case 3:
              errorMessage =
                "Location request timed out. Please check your connection and try again.";
              break;
          }
          alert(errorMessage);

          const defaultLocation = fromLonLat([78.9629, 20.5937]);
          if (mapRef.current) {
            const view = mapRef.current.getView();
            view.setCenter(defaultLocation);
            view.setZoom(5);
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      alert(
        "Geolocation is not supported by this browser. Using default location."
      );

      const defaultLocation = fromLonLat([78.9629, 20.5937]);
      if (mapRef.current) {
        const view = mapRef.current.getView();
        view.setCenter(defaultLocation);
        view.setZoom(5);
      }
    }
  };

  const addUserLocationMarker = (longitude, latitude) => {
    if (mapRef.current) {
      const markerLayer = new VectorLayer({
        source: new VectorSource({
          features: [
            new Feature({
              geometry: new Point(fromLonLat([longitude, latitude])),
            }),
          ],
        }),
        style: new Style({
          image: new CircleStyle({
            radius: 10,
            fill: new Fill({ color: "red" }),
            stroke: new Stroke({ color: "white", width: 2 }),
          }),
        }),
      });

      mapRef.current.addLayer(markerLayer);
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      const view = mapRef.current.getView();
      const zoom = view.getZoom();
      if (zoom !== undefined) {
        view.setZoom(zoom - 1);
      }
    }
  };

  const handleZoomIn = () => {
    if (mapRef.current) {
      const view = mapRef.current.getView();
      const zoom = view.getZoom();
      if (zoom !== undefined) {
        view.setZoom(zoom + 1);
      }
    }
  };

  const refreshMap = () => {
    if (mapRef.current) {
      const map = mapRef.current;
      map
        .getLayers()
        .getArray()
        .slice(1)
        .forEach((layer) => map.removeLayer(layer));
      map
        .getInteractions()
        .getArray()
        .slice(6)
        .forEach((interaction) => map.removeInteraction(interaction));
      map.getView().setCenter(fromLonLat([78.9629, 20.5937]));
      map.getView().setZoom(5);
      setMeasurementToolActive(false);
      setAreaSelectToolActive(false);
      setUserLocation(null);
      if (measureTooltipRef.current) {
        map.removeOverlay(measureTooltipRef.current);
        measureTooltipRef.current = null;
      }

      map
        .getOverlays()
        .getArray()
        .slice()
        .forEach((overlay) => {
          if (overlay.getElement().classList.contains("ol-tooltip-measure")) {
            map.removeOverlay(overlay);
          }
        });
      if (drawRef.current) {
        map.removeInteraction(drawRef.current);
        drawRef.current = null;
      }
    }
  };

  const downloadMap = () => {
    const mapElement = document.getElementById("map");
    if (mapElement) {
      html2canvas(mapElement).then((canvas) => {
        const link = document.createElement("a");
        link.download = "map.png";
        link.href = canvas.toDataURL();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }
  };

  const toggleMeasurementTool = () => {
    if (mapRef.current) {
      const map = mapRef.current;
      if (measurementToolActive) {
        map.removeInteraction(drawRef.current);
        if (measureTooltipRef.current) {
          map.removeOverlay(measureTooltipRef.current);
          measureTooltipRef.current = null;
        }
        setMeasurementToolActive(false);
      } else {
        const source = new VectorSource();
        const vector = new VectorLayer({
          source: source,
          style: new Style({
            fill: new Fill({
              color: "rgba(255, 255, 255, 0.2)",
            }),
            stroke: new Stroke({
              color: "#ffcc33",
              width: 2,
            }),
            image: new CircleStyle({
              radius: 7,
              fill: new Fill({
                color: "#ffcc33",
              }),
            }),
          }),
        });

        map.addLayer(vector);

        const draw = new Draw({
          source: source,
          type: "LineString",
          style: new Style({
            fill: new Fill({
              color: "rgba(255, 255, 255, 0.2)",
            }),
            stroke: new Stroke({
              color: "rgba(0, 0, 0, 0.5)",
              lineDash: [10, 10],
              width: 2,
            }),
            image: new CircleStyle({
              radius: 5,
              stroke: new Stroke({
                color: "rgba(0, 0, 0, 0.7)",
              }),
              fill: new Fill({
                color: "rgba(255, 255, 255, 0.2)",
              }),
            }),
          }),
        });

        drawRef.current = draw;
        map.addInteraction(draw);

        const formatLength = function (line) {
          const length = getLength(line);
          let output;
          if (length > 100) {
            output = Math.round((length / 1000) * 100) / 100 + " km";
          } else {
            output = Math.round(length * 100) / 100 + " m";
          }
          return output;
        };

        const createMeasureTooltip = function () {
          if (measureTooltipRef.current) {
            map.removeOverlay(measureTooltipRef.current);
          }
          const element = document.createElement("div");
          element.className =
            "ol-tooltip ol-tooltip-measure bg-black bg-opacity-50 rounded text-white p-1 opacity-100 whitespace-nowrap text-xs font-bold";
          const tooltip = new Overlay({
            element: element,
            offset: [0, -15],
            positioning: "bottom-center",
            stopEvent: false,
            insertFirst: false,
          });
          map.addOverlay(tooltip);
          measureTooltipRef.current = tooltip;
          return tooltip;
        };

        let sketch;
        let measureStart = false;

        draw.on("drawstart", function (evt) {
          sketch = evt.feature;
          createMeasureTooltip();
          let tooltipCoord = evt.coordinate;

          sketch.getGeometry().on("change", function (evt) {
            const geom = evt.target;
            let output = formatLength(geom);
            tooltipCoord = geom.getLastCoordinate();
            if (measureTooltipRef.current) {
              measureTooltipRef.current.getElement().innerHTML = output;
              measureTooltipRef.current.setPosition(tooltipCoord);
            }
          });
        });

        draw.on("drawend", function () {
          if (measureTooltipRef.current) {
            measureTooltipRef.current.setOffset([0, -7]);
          }
          sketch = null;
          measureStart = false;
        });

        map.on("dblclick", function (evt) {
          if (measurementToolActive) {
            evt.stopPropagation();
            if (!measureStart) {
              measureStart = true;
              draw.removeLastPoint();
            } else {
              draw.finishDrawing();
            }
          }
        });

        map.on("pointermove", function (evt) {
          if (sketch) {
            let tooltipCoord = evt.coordinate;
            if (measureTooltipRef.current) {
              measureTooltipRef.current.setPosition(tooltipCoord);
            }
          }
        });

        setMeasurementToolActive(true);
      }
    }
  };

  const toggleAreaSelectTool = () => {
    if (mapRef.current) {
      const map = mapRef.current;
      if (areaSelectToolActive) {
        map.removeInteraction(map.getInteractions().getArray().pop());
        if (areaTooltipRef.current) {
          map.removeOverlay(areaTooltipRef.current);
          areaTooltipRef.current = null;
        }
        setAreaSelectToolActive(false);
      } else {
        const source = new VectorSource();
        const vector = new VectorLayer({
          source: source,
          style: new Style({
            fill: new Fill({
              color: "rgba(255, 255, 255, 0.2)",
            }),
            stroke: new Stroke({
              color: "#ffcc33",
              width: 2,
            }),
            image: new CircleStyle({
              radius: 7,
              fill: new Fill({
                color: "#ffcc33",
              }),
            }),
          }),
        });

        map.addLayer(vector);

        const dragBox = new DragBox();

        map.addInteraction(dragBox);

        const createAreaTooltip = function () {
          const element = document.createElement("div");
          element.className =
            "ol-tooltip ol-tooltip-measure bg-black bg-opacity-50 rounded text-white p-1 opacity-100 whitespace-nowrap text-xs font-bold";
          const tooltip = new Overlay({
            element: element,
            offset: [0, -15],
            positioning: "bottom-center",
            stopEvent: false,
            insertFirst: false,
          });
          map.addOverlay(tooltip);
          return tooltip;
        };

        dragBox.on("boxend", function () {
          const extent = dragBox.getGeometry().getExtent();
          const boxFeature = new Feature(
            new Polygon([
              [
                [extent[0], extent[1]],
                [extent[0], extent[3]],
                [extent[2], extent[3]],
                [extent[2], extent[1]],
                [extent[0], extent[1]],
              ],
            ])
          );
          source.addFeature(boxFeature);

          const area = getArea(boxFeature.getGeometry());
          const output =
            area > 10000
              ? Math.round((area / 1000000) * 100) / 100 + " km²"
              : Math.round(area * 100) / 100 + " m²";

          const center = boxFeature
            .getGeometry()
            .getInteriorPoint()
            .getCoordinates();

          const areaTooltip = createAreaTooltip();
          areaTooltip.setPosition(center);
          areaTooltip.getElement().innerHTML = output;

          map.getView().fit(boxFeature.getGeometry(), {
            padding: [50, 50, 50, 50],
            duration: 500,
          });
        });

        dragBox.on("boxstart", function () {});

        setAreaSelectToolActive(true);
      }
    }
  };

  return (
    <div className="font-sans bg-gray-100 h-screen flex flex-col relative">
      <a className="skiplink sr-only focus:not-sr-only" href="#map">
        Go to map
      </a>

      <div
        id="map"
        className="map h-[calc(100vh-4rem)] w-full"
        style={{ minHeight: "400px" }}
        tabIndex={0}
      ></div>

      <div className="absolute top-4 right-20 z-50 flex items-center space-x-2">
        <button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IoSettingsSharp size={24} />
        </button>

        <button
          onClick={handleZoomIn}
          className="bg-white h-9 w-9 text-2xl flex justify-center items-center p-2 rounded-full shadow-md  hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          +
        </button>

        <button
          onClick={handleZoomOut}
          className="bg-white h-9 w-9 text-2xl flex justify-center items-center p-2 rounded-full shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          -
        </button>

        {isSettingsOpen && (
          <div className="absolute top-12 left-0 bg-white rounded-md shadow-lg p-2 space-y-2 z-10">
            <button
              onClick={getUserLocation}
              className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100 rounded-md"
            >
              📍 My Location
            </button>
            <button
              onClick={refreshMap}
              className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100 rounded-md"
            >
              <IoRefresh className="mr-2" /> Refresh Map
            </button>
            <button
              onClick={downloadMap}
              className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100 rounded-md"
            >
              <IoDownload className="mr-2" /> Download Map
            </button>
            <button
              onClick={toggleMeasurementTool}
              className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100 rounded-md"
            >
              <IoResize className="mr-2" />
              {measurementToolActive ? "Stop Measuring" : "Start Measuring"}
            </button>
            <button
              onClick={toggleAreaSelectTool}
              className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100 rounded-md"
            >
              <IoSquareOutline className="mr-2" />
              {areaSelectToolActive ? "Stop Area Select" : "Start Area Select"}
            </button>
          </div>
        )}
      </div>
      <div className="ol-tooltip bg-black bg-opacity-50 rounded text-white p-1 opacity-70 whitespace-nowrap text-xs">
        <div className="ol-tooltip-measure opacity-100 font-bold"></div>
        <div className="ol-tooltip-static bg-yellow-400 text-black border border-white"></div>
      </div>
    </div>
  );
};

export default Mapsection;

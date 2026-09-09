"""Dissolve ZIP boundaries without adding or removing covered land. Requires shapely."""
from pathlib import Path
import xml.etree.ElementTree as ET
from shapely.geometry import Polygon
from shapely.ops import unary_union

ROOT = Path(__file__).resolve().parents[1]
NS = 'http://www.opengis.net/kml/2.2'
ET.register_namespace('', NS)
def tag(name):
    return f'{{{NS}}}{name}'

source = ET.parse(ROOT / 'exports/charlotte-service-zip-boundaries.kml')
def ring(element):
    return [tuple(map(float, point.split(',')[:2])) for point in element.find(f'.//{tag("coordinates")}').text.split()]

polygons = []
for element in source.iter(tag('Polygon')):
    polygon = Polygon(ring(element.find(tag('outerBoundaryIs'))),
                      [ring(hole) for hole in element.findall(tag('innerBoundaryIs'))])
    assert polygon.is_valid, 'Invalid source geometry'
    polygons.append(polygon)
merged = unary_union(polygons)
assert merged.is_valid and not merged.is_empty
parts = [merged] if merged.geom_type == 'Polygon' else list(merged.geoms)

root = ET.Element(tag('kml'))
document = ET.SubElement(root, tag('Document'))
ET.SubElement(document, tag('name')).text = 'Queen City Backsplash service area'
ET.SubElement(document, tag('description')).text = 'Merged Census 2020 ZIP areas. Internal ZIP borders removed; original coverage and gaps preserved.'
style = ET.SubElement(document, tag('Style'), id='coverage')
line = ET.SubElement(style, tag('LineStyle'))
ET.SubElement(line, tag('color')).text = 'ff715b00'
ET.SubElement(line, tag('width')).text = '3'
fill = ET.SubElement(style, tag('PolyStyle'))
ET.SubElement(fill, tag('color')).text = '33715b00'

def add_ring(parent, kind, coordinates):
    boundary = ET.SubElement(parent, tag(kind))
    linear = ET.SubElement(boundary, tag('LinearRing'))
    ET.SubElement(linear, tag('coordinates')).text = ' '.join(f'{x:.17g},{y:.17g},0' for x, y in coordinates)

for index, part in enumerate(sorted(parts, key=lambda p: p.area, reverse=True), 1):
    placemark = ET.SubElement(document, tag('Placemark'))
    ET.SubElement(placemark, tag('name')).text = 'Queen City Backsplash service area' + (f' — part {index}' if len(parts) > 1 else '')
    ET.SubElement(placemark, tag('styleUrl')).text = '#coverage'
    polygon = ET.SubElement(placemark, tag('Polygon'))
    ET.SubElement(polygon, tag('tessellate')).text = '1'
    add_ring(polygon, 'outerBoundaryIs', part.exterior.coords)
    for hole in part.interiors:
        add_ring(polygon, 'innerBoundaryIs', hole.coords)
output = ROOT / 'exports/charlotte-service-area-merged.kml'
ET.ElementTree(root).write(output, encoding='utf-8', xml_declaration=True)
result = ET.parse(output)
roundtrip = unary_union([Polygon(ring(p.find(tag('outerBoundaryIs'))), [ring(h) for h in p.findall(tag('innerBoundaryIs'))]) for p in result.iter(tag('Polygon'))])
assert roundtrip.is_valid
assert merged.symmetric_difference(roundtrip).area < 1e-10
assert output.stat().st_size < 5_000_000
print(f'Merged {len(polygons)} ZIP polygon parts into {len(parts)} connected coverage parts; {sum(len(p.interiors) for p in parts)} preserved holes. File: {output} ({output.stat().st_size:,} bytes). Geometry round-trip verified.')

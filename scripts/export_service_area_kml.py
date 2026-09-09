"""Export project ZIP boundaries from the Census 2020 1:500,000 KML archive.

Usage: python scripts/export_service_area_kml.py path/to/cb_2020_us_zcta520_500k.zip
Source: https://www2.census.gov/geo/tiger/GENZ2020/kml/cb_2020_us_zcta520_500k.zip
"""
import copy
import json
from pathlib import Path
import sys
import xml.etree.ElementTree as ET
import zipfile

ROOT = Path(__file__).resolve().parents[1]
NS = 'http://www.opengis.net/kml/2.2'
ET.register_namespace('', NS)
def tag(name):
    return f'{{{NS}}}{name}'

rows = json.loads((ROOT / 'src/service-area-zips.json').read_text(encoding='utf-8-sig'))
requested = {row['zip']: row for row in rows}
assert len(requested) == len(rows), 'Duplicate project ZIP codes'
found = {}
with zipfile.ZipFile(sys.argv[1]) as archive:
    with archive.open(next(name for name in archive.namelist() if name.endswith('.kml'))) as source:
        for _, element in ET.iterparse(source, events=('end',)):
            if element.tag != tag('Placemark'):
                continue
            code = element.find(f'.//{tag("SimpleData")}[@name="ZCTA5CE20"]')
            if code is not None and code.text in requested:
                found[code.text] = [copy.deepcopy(polygon) for polygon in element.iter(tag('Polygon'))]
            element.clear()

kml = ET.Element(tag('kml'))
document = ET.SubElement(kml, tag('Document'))
ET.SubElement(document, tag('name')).text = 'Queen City Backsplash — service ZIP boundaries'
ET.SubElement(document, tag('description')).text = (
    'Census 2020 ZIP Code Tabulation Areas, generalized at 1:500,000. '
    'These approximate ZIP areas; they are not official USPS delivery boundaries. '
    'Source: https://www.census.gov/geographies/mapping-files/2020/geo/carto-boundary-file.html'
)
style = ET.SubElement(document, tag('Style'), id='service-area')
line = ET.SubElement(style, tag('LineStyle'))
ET.SubElement(line, tag('color')).text = 'ff715b00'
ET.SubElement(line, tag('width')).text = '2'
fill = ET.SubElement(style, tag('PolyStyle'))
ET.SubElement(fill, tag('color')).text = '33715b00'
ET.SubElement(fill, tag('fill')).text = '1'
ET.SubElement(fill, tag('outline')).text = '1'
count = 0
for code, polygons in sorted(found.items()):
    row = requested[code]
    for part, polygon in enumerate(polygons, 1):
        count += 1
        placemark = ET.SubElement(document, tag('Placemark'))
        suffix = f' (part {part})' if len(polygons) > 1 else ''
        ET.SubElement(placemark, tag('name')).text = f'{code} — {row["city"]}, {row["state"]}{suffix}'
        ET.SubElement(placemark, tag('description')).text = f'Service ZIP: {code}. Census 2020 ZCTA boundary; approximate ZIP area.'
        ET.SubElement(placemark, tag('styleUrl')).text = '#service-area'
        data = ET.SubElement(placemark, tag('ExtendedData'))
        for name, value in [('ZIP', code), ('Town', row['city']), ('State', row['state'])]:
            field = ET.SubElement(data, tag('Data'), name=name)
            ET.SubElement(field, tag('value')).text = value
        # Separate polygons avoid My Maps' limited MultiGeometry support.
        for coordinates in polygon.iter(tag('coordinates')):
            points = coordinates.text.split()
            assert len(points) >= 4 and points[0] == points[-1], f'Unclosed ring: {code}'
            for point in points:
                lng, lat, *_ = map(float, point.split(','))
                assert -180 <= lng <= 180 and -90 <= lat <= 90
        placemark.append(polygon)

output = ROOT / 'exports'
output.mkdir(exist_ok=True)
path = output / 'charlotte-service-zip-boundaries.kml'
ET.ElementTree(kml).write(path, encoding='utf-8', xml_declaration=True)
assert path.stat().st_size < 5_000_000, 'Exceeds My Maps KML size limit'
assert count < 2000, 'Exceeds My Maps feature limit'
assert len(ET.parse(path).findall(f'.//{tag("Placemark")}')) == count
missing = sorted(set(requested) - set(found))
report = [
    '# Charlotte service ZIP boundaries', '',
    f'Input: src/service-area-zips.json ({len(requested)} ZIP codes).',
    f'Exported: {len(found)} ZIP areas, {count} polygon features; {path.stat().st_size:,} bytes.', '',
    'Import charlotte-service-zip-boundaries.kml in Google My Maps: Add layer > Import.', '',
    'Source: U.S. Census Bureau, 2020 ZCTA cartographic boundaries, 1:500,000.',
    'https://www2.census.gov/geo/tiger/GENZ2020/kml/cb_2020_us_zcta520_500k.zip', '',
    'ZCTAs approximate ZIP areas and are not official USPS delivery boundaries. '
    'The original polygon geometry, including holes, is preserved. Disconnected parts '
    'are separate features for My Maps compatibility.', '',
    '## ZIP codes without a matching Census boundary', '',
    'No boundary was invented for these codes. Some ZIP codes, such as PO Box-only codes, '
    'do not have a ZCTA; absence here does not establish an individual ZIP code\'s type.', '',
    *[f'- {code} — {requested[code]["city"]}, {requested[code]["state"]}' for code in missing],
]
(output / 'charlotte-service-zip-boundaries-notes.md').write_text('\n'.join(report) + '\n', encoding='utf-8')
print(json.dumps({'file': str(path), 'input_zip_count': len(requested), 'matched_zip_count': len(found), 'polygon_count': count, 'bytes': path.stat().st_size, 'missing': missing}, indent=2))

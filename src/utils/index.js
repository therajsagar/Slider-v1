export const getCalculatedValue = ({ value, min, max }) => {
  let outputValue;

  if (value > max) {
    outputValue = max;
  } else if (value < min) {
    outputValue = min;
  } else {
    outputValue = Math.abs(value);
  }

  return outputValue;
};

export const getInterpolatedValueWithPosition = ({
  currentPosition,
  sliderRect,
  min,
  max,
}) => {
  const { left: scaleMin, right: scaleMax } = sliderRect;

  const val = Math.round(
    min + ((max - min) / (scaleMax - scaleMin)) * (currentPosition - scaleMin)
  );

  const value = getCalculatedValue({ min, max, value: val });

  const position = Math.round(
    ((scaleMax - scaleMin) / (max - min)) * (value - min)
  );

  return { value, position };
};

export const getInterpolatedPosition = ({ val, sliderRect, min, max }) => {
  const { left: scaleMin, right: scaleMax } = sliderRect;

  const value = getCalculatedValue({ min, max, value: val });

  const position = Math.round(
    ((scaleMax - scaleMin) / (max - min)) * (value - min)
  );

  return position;
};

export const getMarkerFromSegment = (segmentList, min, max) => {
  let markers = [];

  if (segmentList) {
    markers.push(...[min, max]);

    segmentList.forEach(({ start, end }) => {
      if (start >= min && start <= max) {
        markers.push(start);
      }
      if (end >= min && end <= max) {
        markers.push(end);
      }
    });

    markers = Array.from(new Set(markers));
  } else {
    let tmp = min;
    const unitValue = min || 10;

    while (tmp <= max) {
      markers.push(tmp);
      tmp += unitValue;
    }
  }

  return markers;
};

export const updateElementStyle = (element, position, value) => {
  const offset = position - element.offsetWidth / 2;
  element.dataset.tooltipLabel = value;
  element.style.transform = `translateX(${offset}px)`;
};

const getUpdatedSegments = (segmentList, min, max) => {
  const updatedSegments = segmentList.reduce(
    (list, { start, end, ...rest }) => {
      if (end <= min || start >= max || start >= end) {
        return list;
      }

      return list.concat({
        start: Math.max(start, min),
        end: Math.min(end, max),
        ...rest,
      });
    },
    []
  );

  const segmentStartPointSet = new Set();
  const segmentPointList = Array.from(
    new Set(
      updatedSegments.reduce(
        (list, seg) => {
          segmentStartPointSet.add(seg.start);
          return list.concat(seg.start, seg.end);
        },
        [min, max]
      )
    )
  ).sort((i, j) => i - j);

  for (let idx = 0; idx < segmentPointList.length - 1; idx++) {
    if (!segmentStartPointSet.has(segmentPointList[idx])) {
      updatedSegments.push({
        start: segmentPointList[idx],
        end: segmentPointList[idx + 1],
      });
    }
  }

  return updatedSegments.sort((i, j) => i.start - j.start);
};

export const computeSegments = (segments = [], min, max) => {
  const scaleRange = max - min;
  let segmentList = [];
  let segmentBgCSS = "";

  if (segments.length) {
    segmentList = getUpdatedSegments(segments, min, max);

    let totalWidth = 0;
    segmentBgCSS += "linear-gradient(90deg, ";

    segmentList.forEach(({ color = "transparent", start, end }, idx) => {
      const width = ((end - start) / scaleRange) * 100;

      if (!idx) {
        segmentBgCSS += `${color} ${width}%`;
      } else {
        segmentBgCSS += `,${color} ${totalWidth}%, ${color} ${
          totalWidth + width
        }%`;
      }

      totalWidth += width;
    });

    segmentBgCSS += ")";
  }

  return { segmentList, segmentBgCSS };
};

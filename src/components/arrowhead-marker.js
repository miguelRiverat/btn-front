// @flow
/*
  Copyright(c) 2018 Uber Technologies, Inc.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

          http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import * as React from 'react';

type IArrowheadMarkerProps = {
  edgeArrowSize?: number,
};

class ArrowheadMarker extends React.Component<IArrowheadMarkerProps> {
  static defaultProps = {
    edgeArrowSize: 8,
  };

  render() {
    const { edgeArrowSize } = this.props;

    if (!edgeArrowSize && edgeArrowSize !== 0) {
      return null;
    }

    return (
      <marker
        id="end-arrow"
        key="end-arrow"
        viewBox={`0 -${edgeArrowSize / 2} ${edgeArrowSize} ${edgeArrowSize}`}
        refX={`${edgeArrowSize / 2}`}
        markerWidth={`${edgeArrowSize}`}
        markerHeight={`${edgeArrowSize}`}
        orient="auto"
      >
        <path
          className="arrow"
          d={`M0,-${edgeArrowSize / 2}L${edgeArrowSize},0L0,${edgeArrowSize / 2}`}
        />
      </marker>
    );
  }
}

export default ArrowheadMarker;

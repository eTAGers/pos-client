import React from 'react';
import { useBarcode } from 'react-barcodes';

function CommonBarcode(props) {
    const { inputRef } = useBarcode({
        value: props.singleFAR.name,
        options: {
          text: props.singleFAR.materialID
        }
      });
    
      return <svg ref={inputRef} />;
}

export default CommonBarcode;
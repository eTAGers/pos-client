import React from "react";

function CommonPrint(props = {}) {
  return (
    <div>
      <div style={{display: "flex", width: "100%" , paddingBottom: "20px"}}>
        <div >
          <div >
            <b>ESTIMATE </b>
          </div>
          <div >
            3/1300/5, Parani Krishna Agencies Sivakasi To Sattur Road
            Paraipatti, Sivakasi{" "}
          </div>
          <div >
            Mobile - 76399 47155{" "}
          </div>
          <div >
            Email - sivakasikarthicrackers@gmail.com{" "}
          </div>
        </div>
        <div >
          <img src="images/logo.jpg"  />
        </div>
      </div>
      {/* <div style="display: flex; width: 100%;">
          <div style="width:100%; padding:0 0px;">
              <div style="border-top: 2px solid #eaeaea;"></div>
          </div> 
      </div> */}
      {/* <div style="display: flex; width:100%; font-size:14px;">
          <div style=" width:33.3%; padding:20px 40px 20px 40px;">
              <div style="font-size:16px; padding-bottom:10px; color: #004aab;"><b>Date: </b></div> 
              <div style="font-size:14px;">${new Date()
                .toJSON()
                .slice(0, 10)
                .replace(/-/g, "/")} </div> 
          </div>
          <div style=" width:33.3%; padding:20px 40px 20px 40px;">
              <div style="font-size:16px; padding-bottom:10px; color: #004aab;"><b>Estimate No: </b></div> 
              <div style="font-size:14px;">ES 202301</div>
          </div>
          <div style=" width:33.3%; padding:20px 40px 20px 40px; text-align: right;">
              <div style="font-size:16px; padding-bottom:10px; color: #004aab;"><b>Estimate To: </b></div> 
              <div style="font-size:14px;">${props.customerName} </div>
              <div style="font-size:14px;">${props.customerMobile} </div>
              <div style="font-size:14px;">${props.customerCity} </div>
          </div>
      </div> */}
      {/* <div style="padding:0 0px;">
          <table style="border-collapse: collapse; width:100%; padding:40px 50px 10px 50px;" class="clr">
              <tr style="font-size:13px; background-color: #004aab; color:#fff;">
                  <th style="width:60px; padding: 15px 15px; text-align: center;">S.NO</th>
                  <th style="width:60px; padding: 15px 15px; text-align: center;">Product Name</th>
                  <th style="width:100px; padding: 15px 15px; text-align: center;">Product Qty</th>
                  <th style="width:60px; padding: 15px 15px; text-align: center;">Product Cost Per Unit</th>
                  <th style="width:60px; padding: 15px 15px; text-align: center;">Product Cost</th>
              </tr> 
              ${props?.salesProducts.map((e, i) => {
                return `
                <tr style="font-size:14px; background:#fff; border-bottom:1px solid #ababab; color: #9d9d9d; padding:5px;">
                <td style="width:60px;  padding:5px; text-align: center;">${
                  i + 1
                } </td>
                <td style="width:60px; padding:5px; text-align: center;">${
                  e.productName
                }</td>
                <td style="width:100px; padding:5px; text-align: center;">${
                  e.productQty
                }</td>
                <td style="width:60px; padding:5px; text-align: center;">${
                  e.productCost
                }</td>
                <td style="width:60px; padding:5px; text-align: center;">${
                  e.productCost * e.productQty
                }</td>
                </tr>
                `;
              })}
            
              
              <tr style="font-size:14px; background:#fff; color: #004aab;">
                  <td style="width:100px; padding:5px 15px; text-align: right;" colspan="3">Subtotal : </td>
                  <td style="width:10px; padding:5px 25px; text-align: left;" colspan="3">${props.salesProducts.reduce(
                    (a, b) => Number(b.productCost) * Number(b.productQty) + a,
                    0
                  )}</td>
              </tr>
              <tr style="font-size:14px; background:#fff; color: #004aab;">
                  <td style="width:100px; padding:5px 15px; text-align: right;" colspan="3">Discount : </td>
                  <td style="width:10px; padding:5px 25px; text-align: left;" colspan="3">${
                    props.discount
                  }%</td>
              </tr>
              <tr style="font-size:14px; background:#fff; color: #004aab;">
              <td style="width:100px; padding:5px 15px; text-align: right;" colspan="3">Packing Charges (3%) : </td>
              <td style="width:10px; padding:5px 25px; text-align: left;" colspan="3">Rs.${
                props.packingCost
              }</td>
              </tr>
              <tr style="font-size:14px; background:#fff; color: #004aab;">
                  <td style="width:100px; padding:5px 15px; text-align: right;" colspan="3">Total : </td>
                  <td style="width:10px; padding:5px 25px; text-align: left;" colspan="3">Rs.${
                    props.salesProducts.reduce(
                      (a, b) =>
                        Number(b.productCost) * Number(b.productQty) + a,
                      0
                    ) -
                    props.salesProducts.reduce(
                      (a, b) =>
                        Number(b.productCost) * Number(b.productQty) + a,
                      0
                    ) *
                      (Number(props.discount) / 100) +
                    Number(props.packingCost)
                  }</td>
              </tr>
             
            
              <tr style="background:#004aab; color: #fff;">
                  <td style="width:100px; font-size:14px; padding:5px 15px; text-align: left;" colspan="2">Total Items : ${
                    props.salesProducts.length
                  }</td>
                  <td style="width:100px; font-size:14px; padding:5px 15px; text-align: right;" colspan="2">Overall Total : </td>
                  <td style="width:120px; font-size:18px; padding:5px 25px; text-align: right;" colspan="2">Rs.${
                    props.salesProducts.reduce(
                      (a, b) =>
                        Number(b.productCost) * Number(b.productQty) + a,
                      0
                    ) -
                    props.salesProducts.reduce(
                      (a, b) =>
                        Number(b.productCost) * Number(b.productQty) + a,
                      0
                    ) *
                      (Number(props.discount) / 100) +
                    Number(props.packingCost)
                  }</td>
              </tr>
          </table>
      </div> */}
    </div>
  );
}

export default CommonPrint;


import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const NetworkGraph = ({ nodes, links }) => {
  console.log(nodes, links);
  const ref = useRef();
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10); 

  useEffect(() => {
    const svg = d3.select(ref.current)
      .attr('width', 2000)
      .attr('height', 1000)
      .style('border', '1px solid black');

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).strength(0.05))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(1000, 500));
      simulation.force("collide", d3.forceCollide(50)); 

    const link = svg.append("g")
      .attr("stroke", "#999")
      .selectAll("line")
      .data(links)
      .join("line");

    const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
        .attr("r", 10)
        .attr("fill", d => colorScale(d.group));  


    const label = svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .selectAll("text")
      .data(nodes)
      .join("text")
        .attr("dx", 15)
        .attr("dy", ".35em")
        .text(d => d.title);
    



    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      label
        .attr("x", d => d.x)
        .attr("y", d => d.y);
    });

    function colorNode(d) {
      return d.group === 1 ? 'red' : 'blue';
    }
  }, [nodes, links]);

  return <svg ref={ref}></svg>;
};

export default NetworkGraph;




//3
// src/components/NetworkGraph.js
// import React, { useEffect, useRef } from 'react';
// import * as d3 from 'd3';

// const NetworkGraph = ({ nodes, links }) => {
//   const ref = useRef();

//   useEffect(() => {
//     const width = 2000;
//     const height = 1300;

//     const svg = d3.select(ref.current)
//       .attr('width', width)
//       .attr('height', height)
//       .style('border', '1px solid black');

//     const groupScale = d3.scaleOrdinal()
//       .domain([1, 2, 3])
//       .range([100, 400, 700]);  // Adjust range to space out groups vertically

//     const simulation = d3.forceSimulation(nodes)
//       .force("link", d3.forceLink(links).id(d => d.id).distance(50))
//       .force("charge", d3.forceManyBody().strength(-500))
//       .force("x", d3.forceX().x(d => groupScale(d.group)))
//       .force("y", d3.forceY(height / 2))
//       .force("center", d3.forceCenter(width / 2, height / 2))
//       .force("collide", d3.forceCollide().radius(function(d) {
//         return d.title.length * 2;  
//       }))
      

//     const link = svg.append("g")
//       .attr("stroke", "#999")
//       .selectAll("line")
//       .data(links)
//       .join("line");

//     const label = svg.append("g")
//       .attr("font-family", "sans-serif")
//       .attr("font-size", 12)
//       .selectAll("text")
//       .data(nodes)
//       .join("text")
//         .text(d => d.title)
//         .attr("text-anchor", "middle")
//         .attr("x", d => groupScale(d.group))
//         .attr("y", height / 2)
//         .call(d3.drag()
//           .on("start", event => {
//             if (!event.active) simulation.alphaTarget(0.3).restart();
//             event.subject.fx = event.subject.x;
//             event.subject.fy = event.subject.y;
//           })
//           .on("drag", event => {
//             event.subject.fx = event.x;
//             event.subject.fy = event.y;
//           })
//           .on("end", event => {
//             if (!event.active) simulation.alphaTarget(0);
//             event.subject.fx = null;
//             event.subject.fy = null;
//           }));

//     simulation.on("tick", () => {
//       link
//         .attr("x1", d => d.source.x)
//         .attr("y1", d => d.source.y)
//         .attr("x2", d => d.target.x)
//         .attr("y2", d => d.target.y);

//       label
//         .attr("x", d => d.x)
//         .attr("y", d => d.y);
//     });
//   }, [nodes, links]);

//   return <svg ref={ref}></svg>;
// };

// export default NetworkGraph;

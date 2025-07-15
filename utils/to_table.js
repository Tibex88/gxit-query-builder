
export  default function to_table(content) {

  const rows = [];
  
  // Headers
  rows.push(['ID', 'Type', 'Chr', 'Start', 'End', 'Genes'].join('\t'));

  content.nodes.forEach(group => {
    if (!group.data || !Array.isArray(group.data.nodes)) return;

    group.data.nodes.forEach(node => {
      const id = node.id || '';
      const type = node.type || '';
      const chr = node.chr || '';
      const start = node.start || '';
      const end = node.end || '';

      // Handle genes array whether it's a string or an actual array
      let genes = node.genes;
      if (typeof genes === 'string') {
        try {
          genes = JSON.parse(genes);
        } catch {
          genes = [genes]; // fallback
        }
      }
      const genesStr = Array.isArray(genes) ? genes.join(', ') : genes;

      rows.push([id, type, chr, start, end, genesStr].join('\t'));
    });
  });

  tsvOutput = rows.join('\n');
  return tsvOutput;
}

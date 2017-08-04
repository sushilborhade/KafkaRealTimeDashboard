import java.util.Iterator;
import java.util.List;
import java.util.Set;

import com.google.common.collect.HashBasedTable;
import com.google.common.collect.Table;
import com.google.common.collect.Table.Cell;

public class GuavaTableTest {

	public static void main(String[] args) {
		Table<String, List<Integer>, List<String>> table = HashBasedTable.create();
		Set<Cell<String, List<Integer>, List<String>>> cellSet = table.cellSet();
		Iterator<Cell<String, List<Integer>, List<String>>> iterator = cellSet.iterator();
		Cell<String, List<Integer>, List<String>> next = iterator.next();
//		table.put("aux", arg1, arg2)
		
	}

}

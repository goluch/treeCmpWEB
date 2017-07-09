package pl.gda.pg.eti.controller;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Scanner;

import javax.servlet.ServletContext;
import javax.validation.Valid;

import org.springframework.boot.*;
import org.springframework.boot.autoconfigure.*;
import org.springframework.stereotype.*;
import org.springframework.web.bind.annotation.*;

import org.apache.catalina.servlet4preview.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;

import pl.gda.pg.eti.model.JsonTrees;
import pl.gda.pg.eti.model.Mode;
import pl.gda.pg.eti.model.Newick;
import pl.gda.pg.eti.utils.ConfigParser;
import pl.gda.pg.eti.utils.HtmlUtils;
import pl.gda.pg.eti.utils.NewickSplitter;
import pl.gda.pg.eti.utils.NewickUtils;
import pl.gda.pg.eti.utils.NewickValidator;

@Controller
@Scope("session")
@EnableAutoConfiguration
public class NewickController {
	
	private static String METRICS = "-d";
	private static String NORMALIZED_DISTANCES = "-N";
	private static String PRUNE_COMPARED = "-P";
	private static String INCLUDE_SUMMARY = "-I";
	private static String INPUT_FILE = "-i";
	private static String OUTPUT_FILE = "-o";

	@Autowired
	ServletContext servletContext;

	private List<String> arguments = new ArrayList<String>();
	private ConfigParser confParser = new ConfigParser();
	private HtmlUtils htmlUtils = new HtmlUtils();
	
	private NewickSplitter splitter;
	private NewickSplitter referencedTreesSplitter;
	private String reportStr;
	private Mode comparisionMode;

	public static void main(String[] args) throws Exception {
		SpringApplication.run(NewickController.class, args);
	}

	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String greeting(@RequestParam(value = "name", required = false, defaultValue = "World") String name, Model model) {
		model.addAttribute("name", name);
		return "greeting";
	}

	@RequestMapping(value = "/WEB", method = RequestMethod.GET)
	public ModelAndView getNewick(Model model) {

		if (confParser.getMetricConfigFilePath().equals("")) {
			String configPath = servletContext
					.getRealPath("/WEB-INF/lib/config/");
			
			confParser.setMetricConfigFilePath(configPath);
		}
		
		confParser.clearAndSetAvailableMetrics();

		model.addAttribute("rootedMetrics", confParser.getAvailableRootedMetricsWithCmd());
		model.addAttribute("unrootedMetrics", confParser.getAvailableUnrootedMetricsWithCmd());

		return new ModelAndView("newick", "newickStringNew", new Newick());
	}
	
	@InitBinder
	protected void initBinder(WebDataBinder binder) { 
	}

	@RequestMapping(value = "/trees/", method = RequestMethod.GET)
	public ModelAndView visualizeTrees(@RequestParam Map<String, String> treesIds, Model model) {
		try	{
			int firstTreeId = Integer.parseInt(treesIds.get("firstTreeId"));
			model.addAttribute("firstTreeId", firstTreeId);
			
			int secondTreeId = Integer.parseInt(treesIds.get("secondTreeId"));			
			model.addAttribute("secondTreeId", secondTreeId);
			
			String shortTable = htmlUtils.GenerateShortenedReport(reportStr, firstTreeId, secondTreeId);
			model.addAttribute("shortTable", shortTable);
		}
		catch(Exception e) {
		}		
		
		return new ModelAndView("trees", "JsonTrees", new JsonTrees());		
	}
	
	@RequestMapping(value = "/report", method = RequestMethod.POST)
	public ModelAndView report(
			@ModelAttribute("newickStringNew") @Valid Newick newick,
			BindingResult bindingResult, ModelMap model) throws IOException {
		NewickUtils nu = new NewickUtils();
		
		if (arguments != null) {
			arguments.clear();
		}
		
		File inputFile = nu.createTempFileWithGivenContent(newick.getNewickStringFirst());
		File refTreeFile = null;
		
		if (newick.getComparisionMode().equals(NewickUtils.MATRIX_COMPARISION_MODE)) {
			arguments.add(NewickUtils.MATRIX_COMPARISION_MODE);
			comparisionMode = Mode.MATRIX;
			String normalizedFirstNewick = NewickUtils.GetNormalizedNewickString(newick.getNewickStringFirst());
			splitter = new NewickSplitter(normalizedFirstNewick);
			
		} else if (newick.getComparisionMode().equals(NewickUtils.BIPARTITE_COMPARISION_MODE)) {
			arguments.add(NewickUtils.BIPARTITE_COMPARISION_MODE);
			comparisionMode = Mode.BIPARTITE;
            refTreeFile = nu.createTempFileWithGivenContent(newick.getNewickStringSecond());
            
            String normalizedFirstNewick = NewickUtils.GetNormalizedNewickString(newick.getNewickStringFirst());
			splitter = new NewickSplitter(normalizedFirstNewick);
			String normalizedSecondNewick = NewickUtils.GetNormalizedNewickString(newick.getNewickStringSecond());
			referencedTreesSplitter = new NewickSplitter(normalizedSecondNewick);

            arguments.add(String.format("%s", refTreeFile.getAbsolutePath()));
		}

		
		NewickValidator newickVal = new NewickValidator(newick);
		
		newickVal.validate(inputFile, refTreeFile);
		
		if (!newickVal.getErrors().isEmpty()) {
			for (ObjectError objErr : newickVal.getErrors()) {
				bindingResult.addError(objErr);
			}
		}
		
		if (bindingResult.hasErrors()) {
			model.addAttribute("rootedMetrics", confParser.getAvailableRootedMetricsWithCmd());
			model.addAttribute("unrootedMetrics", confParser.getAvailableUnrootedMetricsWithCmd());
			
			return new ModelAndView("newick", "newickStringNew", newick);
		} else {			
			addMetricsToArguments(newick);

			// Input output files section

			arguments.add((String.format("%s", INPUT_FILE)));
			arguments.add((String.format("%s", inputFile.getAbsolutePath())));
			
			String outputFilePath = String.format("%s.out", inputFile.getAbsolutePath());
			
			arguments.add((String.format("%s", OUTPUT_FILE)));
			arguments.add(outputFilePath);
			
			// end section

			// Optional options section -N -P -I

			if (newick.isNormalizedDistances()) {
				arguments.add((String.format("%s", NORMALIZED_DISTANCES)));
			}

			if (newick.isPruneTrees()) {
				arguments.add(String.format("%s", PRUNE_COMPARED));
			}
			Boolean includeSummary = false;
			
			if (newick.isIncludeSummary()) {
				arguments.add(String.format("%s", INCLUDE_SUMMARY));
				includeSummary = true;
			}
			
			String[] argumentsToArray = new String[arguments.size()];
			arguments.toArray(argumentsToArray);
			String configPath = servletContext
					.getRealPath("/WEB-INF/lib/config/");
			System.out.println(configPath);
			String dataPath = servletContext.getRealPath("/WEB-INF/lib/data");
			TreeCmpExecutor executor;
			try {
				executor = new TreeCmpExecutor(configPath, dataPath,
						argumentsToArray);
				executor.Execute();
				
				inputFile.delete();
			} catch (Exception e) {
				//e.printStackTrace();
			}
			
			Scanner outputFileScanner = new Scanner(new File(outputFilePath));
			
			if(outputFileScanner.hasNext()) {
				reportStr = outputFileScanner.useDelimiter("\\Z").next();		
				String myReport = htmlUtils.GenerateReportTable(reportStr, includeSummary);
				model.addAttribute("report", myReport);
			}
			else {
				model.addAttribute("report", "<br/><h3><center>Program return a blank report</center></h3><p><center><h4>Probably inputted trees have some different leaves. Please check the leaves labels or use \"Prune trees\" option.</h4></p></center><br/> ");
			}
			outputFileScanner.close();

			return new ModelAndView("report", model);
		}
	}
	
	@RequestMapping(value="/trees", method=RequestMethod.POST)	
	public @ResponseBody JsonTrees provideTree(@RequestBody final JsonTrees tree) {
		if(comparisionMode == Mode.MATRIX) {
			tree.firstTreeNewick = splitter.GetTree(tree.firstTreeId-1);
			tree.secondTreeNewick = splitter.GetTree(tree.secondTreeId-1);
		}
		else {
			tree.firstTreeNewick = splitter.GetTree(tree.secondTreeId-1);
			tree.secondTreeNewick = referencedTreesSplitter.GetTree(tree.firstTreeId-1);
		}
		
		return tree;
	}
	
	private void addMetricsToArguments(Newick newick) {
		arguments.add(String.format("%s", METRICS));

		StringBuilder sb = new StringBuilder();
		
		for (String rootedMetric : newick.getRootedMetrics()) {
			sb.append(String.format("%s ", rootedMetric));
		}
		for (String unrootedMetric : newick.getUnrootedMetrics()) {
			sb.append(String.format("%s ", unrootedMetric));
		}
		
		//Remove additional white space at the end
		sb.deleteCharAt(sb.length() - 1);
		
		arguments.add(sb.toString());
	}
}

---@diagnostic disable: cast-local-type

-- create csv with entries like this:
-- PREVIOUS_KEY_CODE, KEY_CODE, IS_OVERLAPPING_WITH_PREVIOUS, DELAY_TO_PRESS, TIME_HELD
-- 56, 31, 1, 300, 40

local function get_txt_file_names_in_current_directory()
    local output = io.popen("ls -a")

    if output == nil then return end

    local filenames = {}

    for filename in output:lines() do
        if string.find(filename, ".*%.txt$") ~= nil then
            table.insert(filenames, filename)
        end
    end

    output:close()

    return filenames
end

local function create_result_file()
    io.popen("touch result.csv")
    local result_file = io.open("result.csv", "w+")
    
    if result_file == nil then
        return nil
    end

    return result_file
end

local function split(input_string, delimeter)
    local results = {}

    local start_index = 0
    local end_index = 1

    repeat

        start_index = start_index + 1
        start_index, end_index = string.find(input_string, "[^" .. delimeter .."]*", start_index)

        if start_index == nil or end_index == nil then break end
        
        table.insert(results, string.sub(input_string, start_index, end_index))
        start_index = string.find(input_string, delimeter, end_index)

    until start_index == nil

    return results
end

local filenames = get_txt_file_names_in_current_directory()
if filenames == nil then print("Failed to get filenames"); return end

local result_file = create_result_file()
if result_file == nil then print("Failed to create result file"); return end


for _, filename in pairs(filenames) do
    local file_lines = {}

    local data_file = io.open(filename, "r")
    if data_file == nil then print("Failed to open data file with name " .. filename); return end

    for index, line in data_file:lines() do
        table.insert(file_lines, line)
    end

    data_file:close()

    -- Create data entry for clean CSV

    local previous_character, current_character, is_overlapping, time_held, time_since_key_press
    for index, line in ipairs(file_lines) do
        if index == 1 then
            previous_character = " "
        else
            previous_character = file_lines[index - 1][]
        end
    end

    result_file:write(filename)

end

result_file:close()

split("1002	10319	The results were expected back Tuesday.	The results were expected back Tuesday.	494136	1471948496904	1471948497169	SHIFT	16", "\t")

-- For every file in folder ending in txt
-- -- for each line in file
-- -- tokenize on TAB
-- -- Combine last two time columns for time elapsed